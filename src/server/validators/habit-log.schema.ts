import { z } from "zod";

export const upsertHabitLogSchema = z.object({
  value: z.number().int().min(0, "value must be non-negative").default(1),
  note: z.string().max(500, "note is too long").nullable().optional(),
});

export type UpsertHabitLogInput = z.infer<typeof upsertHabitLogSchema>;

export const getHabitLogsQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "from date must be YYYY-MM-DD"),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "to date must be YYYY-MM-DD"),
  habitId: z.string().optional(),
});

export type GetHabitLogsQuery = z.infer<typeof getHabitLogsQuerySchema>;
