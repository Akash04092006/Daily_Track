import { z } from "zod";

export const upsertDailyEntrySchema = z.object({
  mood: z.number().int().min(1).max(5).nullable().optional(),
  energy: z.number().int().min(1).max(5).nullable().optional(),
  focus: z.number().int().min(1).max(5).nullable().optional(),
  reflection: z.string().max(2000).nullable().optional(),
  wins: z.string().max(2000).nullable().optional(),
});

export type UpsertDailyEntryInput = z.infer<typeof upsertDailyEntrySchema>;

export const getDailyEntriesQuerySchema = z.object({
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "from date must be YYYY-MM-DD")
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "to date must be YYYY-MM-DD")
    .optional(),
});

export type GetDailyEntriesQuery = z.infer<typeof getDailyEntriesQuerySchema>;
