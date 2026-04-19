import { Router } from "express";
import { randomUUID } from "crypto";
import { eq, and, ilike, or } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  requestsTable,
  actionHistoryTable,
  systemLogsTable,
} from "@workspace/db/schema";
import { tokenStore } from "../lib/tokenStore.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "rsr-admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "4451";

/** Normalize a route param that Express 5 types as `string | string[] | undefined` to a plain string. */
function paramStr(value: string | string[] | undefined): string | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

router.post("/commander/login", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = randomUUID();
    tokenStore.add(token);

    await db.insert(systemLogsTable).values({
      event: "commander_login_success",
      details: `Commander authenticated — session token issued`,
    });

    res.json({ token, authenticated: true });
  } else {
    await db.insert(systemLogsTable).values({
      event: "commander_login_failure",
      details: `Failed login attempt — username: ${username ?? "(none)"}`,
    });

    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/commander/logout", requireAuth, async (req, res) => {
  const token = req.headers.authorization?.slice(7);
  if (token) tokenStore.delete(token);
  res.json({ message: "Logged out" });
});

router.get("/commander/session", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.json({ authenticated: false });
    return;
  }
  const token = auth.slice(7);
  res.json({ authenticated: tokenStore.has(token) });
});

router.get("/commander/requests", requireAuth, async (req, res) => {
  const { status, q } = req.query as { status?: string; q?: string };

  let results = await db.select().from(requestsTable).orderBy(requestsTable.createdAt);

  if (status) {
    results = results.filter((r) => r.status === status);
  }
  if (q) {
    const lower = q.toLowerCase();
    results = results.filter(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        r.organization.toLowerCase().includes(lower) ||
        r.email.toLowerCase().includes(lower) ||
        r.subject.toLowerCase().includes(lower) ||
        r.displayId.toLowerCase().includes(lower)
    );
  }

  res.json(results);
});

router.get("/commander/requests/:id", requireAuth, async (req, res) => {
  const id = paramStr(req.params["id"]);
  if (!id) { res.status(400).json({ error: "Missing request ID" }); return; }

  const [request] = await db
    .select()
    .from(requestsTable)
    .where(eq(requestsTable.id, id));

  if (!request) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  const history = await db
    .select()
    .from(actionHistoryTable)
    .where(eq(actionHistoryTable.requestId, id))
    .orderBy(actionHistoryTable.timestamp);

  res.json({ ...request, history });
});

router.patch("/commander/requests/:id/status", requireAuth, async (req, res) => {
  const id = paramStr(req.params["id"]);
  if (!id) { res.status(400).json({ error: "Missing request ID" }); return; }
  const { status, note } = req.body ?? {};

  if (!status) {
    res.status(400).json({ error: "status is required" });
    return;
  }

  const [existing] = await db
    .select()
    .from(requestsTable)
    .where(eq(requestsTable.id, id));

  if (!existing) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  const [updated] = await db
    .update(requestsTable)
    .set({ status, updatedAt: new Date() })
    .where(eq(requestsTable.id, id))
    .returning();

  await db.insert(actionHistoryTable).values({
    requestId: id,
    action: `status_changed:${status}`,
    actor: "commander",
    note: note ?? null,
  });

  await db.insert(systemLogsTable).values({
    event: "status_updated",
    details: `Request ${id} status → ${status}`,
  });

  res.json(updated);
});

router.patch("/commander/requests/:id/notes", requireAuth, async (req, res) => {
  const id = paramStr(req.params["id"]);
  if (!id) { res.status(400).json({ error: "Missing request ID" }); return; }
  const { internalNotes } = req.body ?? {};

  const [updated] = await db
    .update(requestsTable)
    .set({ internalNotes: internalNotes ?? null, updatedAt: new Date() })
    .where(eq(requestsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  await db.insert(actionHistoryTable).values({
    requestId: id,
    action: "notes_updated",
    actor: "commander",
    note: null,
  });

  res.json(updated);
});

router.post("/commander/requests/:id/dispatch", requireAuth, async (req, res) => {
  const id = paramStr(req.params["id"]);
  if (!id) { res.status(400).json({ error: "Missing request ID" }); return; }

  const [existing] = await db
    .select()
    .from(requestsTable)
    .where(eq(requestsTable.id, id));

  if (!existing) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  const [updated] = await db
    .update(requestsTable)
    .set({
      packetSent: true,
      packetSentAt: new Date(),
      status: "dispatched",
      updatedAt: new Date(),
    })
    .where(eq(requestsTable.id, id))
    .returning();

  await db.insert(actionHistoryTable).values({
    requestId: id,
    action: "packet_dispatched",
    actor: "commander",
    note: `Information packet dispatched to ${existing.email}`,
  });

  await db.insert(systemLogsTable).values({
    event: "packet_dispatched",
    details: `Packet sent for request ${id} to ${existing.email}`,
  });

  res.json(updated);
});

router.get("/commander/logs", requireAuth, async (req, res) => {
  const logs = await db
    .select()
    .from(systemLogsTable)
    .orderBy(systemLogsTable.timestamp);
  res.json(logs.reverse());
});

export default router;
