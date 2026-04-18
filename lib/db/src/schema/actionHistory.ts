import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const actionHistoryTable = pgTable("bds_action_history", {
  id: serial("id").primaryKey(),
  requestId: text("request_id").notNull(),
  action: text("action").notNull(),
  actor: text("actor").notNull(),
  note: text("note"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

export const insertActionHistorySchema = createInsertSchema(actionHistoryTable).omit({
  id: true,
  timestamp: true,
});

export type InsertActionHistory = z.infer<typeof insertActionHistorySchema>;
export type ActionHistory = typeof actionHistoryTable.$inferSelect;
