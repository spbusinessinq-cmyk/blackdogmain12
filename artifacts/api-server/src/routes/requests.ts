import { Router } from "express";
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
      })
      .returning();

    await db.insert(systemLogsTable).values({
      event: "request_submitted",
      details: `New request from ${name} (${organization}) — ID: ${id}`,
    });

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
