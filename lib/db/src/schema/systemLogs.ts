import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const systemLogsTable = pgTable("bds_system_logs", {
  id: serial("id").primaryKey(),
  event: text("event").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSystemLogSchema = createInsertSchema(systemLogsTable).omit({
  id: true,
  timestamp: true,
});

export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogsTable.$inferSelect;
