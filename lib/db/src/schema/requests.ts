import { pgTable, text, boolean, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const requestsTable = pgTable("bds_requests", {
  id: text("id").primaryKey(),
  seqNum: serial("seq_num").notNull(),
  displayId: text("display_id").notNull().default(""),
  name: text("name").notNull(),
  organization: text("organization").notNull(),
  email: text("email").notNull(),
  requestType: text("request_type").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  linkedSystem: text("linked_system").notNull().default("General"),
  status: text("status").notNull().default("pending"),
  internalNotes: text("internal_notes"),
  packetSent: boolean("packet_sent").notNull().default(false),
  packetSentAt: timestamp("packet_sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertRequestSchema = createInsertSchema(requestsTable).omit({
  seqNum: true,
  displayId: true,
  status: true,
  internalNotes: true,
  packetSent: true,
  packetSentAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type BdsRequest = typeof requestsTable.$inferSelect;
