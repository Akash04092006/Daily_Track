import { z } from "zod";
import { GOAL_STATUSES } from "@/lib/constants";

export const createGoalSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long").trim(),
  description: z.string().max(1000).trim().nullable().optional(),
  category: z.string().min(1, "Category is required").max(50).trim(),
  status: z.enum(GOAL_STATUSES).default("active"),
  targetValue: z.number().int().min(1).nullable().optional(),
  currentValue: z.number().int().min(0).default(0),
  unit: z.string().max(30).nullable().optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid startDate format"),
  targetDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid targetDate format")
    .nullable()
    .optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const updateGoalSchema = z.object({
  title: z.string().min(1, "Title is required").max(100).trim().optional(),
  description: z.string().max(1000).trim().nullable().optional(),
  category: z.string().min(1).max(50).trim().optional(),
  status: z.enum(GOAL_STATUSES).optional(),
  targetValue: z.number().int().min(1).nullable().optional(),
  currentValue: z.number().int().min(0).optional(),
  unit: z.string().max(30).nullable().optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid startDate format")
    .optional(),
  targetDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid targetDate format")
    .nullable()
    .optional(),
  completedAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid completedAt format")
    .nullable()
    .optional(),
});

export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

export const createMilestoneSchema = z.object({
  title: z.string().min(1, "Milestone title is required").max(150).trim(),
  isDone: z.boolean().default(false),
  sortOrder: z.number().int().optional(),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;

export const updateMilestoneSchema = z.object({
  title: z.string().min(1, "Milestone title is required").max(150).trim().optional(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;

export const linkHabitsSchema = z.object({
  habitIds: z.array(z.string().min(1)),
});

export type LinkHabitsInput = z.infer<typeof linkHabitsSchema>;
