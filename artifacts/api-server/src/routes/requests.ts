import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { requestsTable, systemLogsTable } from "@workspace/db/schema";
import { randomUUID } from "crypto";

const router = Router();

router.post("/requests", async (req, res) => {
  try {
    const { name, organization, email, requestType, subject, message, linkedSystem } = req.body;

    if (!name || !organization || !email || !requestType || !subject || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const id = randomUUID();

    // Insert first to get auto-generated seqNum, then back-fill displayId
    const [created] = await db
      .insert(requestsTable)
      .values({
        id,
        name: String(name),
        organization: String(organization),
        email: String(email),
        requestType: String(requestType),
        subject: String(subject),
        message: String(message),
        linkedSystem: linkedSystem ? String(linkedSystem) : "General",
        status: "pending",
        displayId: "pending",
      })
      .returning();

    const displayId = `BDS-REQ-${String(created.seqNum).padStart(4, "0")}`;

    const [withId] = await db
      .update(requestsTable)
      .set({ displayId })
      .where(eq(requestsTable.id, id))
      .returning();

    const final = withId ?? { ...created, displayId };

    await db.insert(systemLogsTable).values({
      event: "request_submitted",
      details: `New request ${displayId} from ${name} (${organization})`,
    });

    res.status(201).json(final);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
