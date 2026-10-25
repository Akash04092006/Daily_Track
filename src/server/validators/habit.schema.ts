import { z } from "zod";
import {
  HABIT_CATEGORIES,
  FREQUENCY_TYPES,
  ICON_KEYS,
  COLOR_KEYS,
} from "@/lib/constants";

export const createHabitSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long").trim(),
  description: z
    .string()
    .max(500, "Description is too long")
    .trim()
    .nullable()
    .optional(),
  category: z.enum(HABIT_CATEGORIES),
  icon: z.enum(ICON_KEYS).nullable().optional(),
  color: z.enum(COLOR_KEYS).nullable().optional(),
  frequencyType: z.enum(FREQUENCY_TYPES).default("daily"),
  frequencyDays: z
    .string()
    .regex(/^([0-6](,[0-6])*)?$/, "frequencyDays must be comma-separated digits (0-6)")
    .nullable()
    .optional(),
  targetPerDay: z.number().int().min(1, "targetPerDay must be at least 1").default(1),
  unit: z.string().max(30).nullable().optional(),
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "reminderTime must be in HH:mm format")
    .nullable()
    .optional(),
  sortOrder: z.number().int().optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;

export const updateHabitSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title is too long")
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, "Description is too long")
    .trim()
    .nullable()
    .optional(),
  category: z.enum(HABIT_CATEGORIES).optional(),
  icon: z.enum(ICON_KEYS).nullable().optional(),
  color: z.enum(COLOR_KEYS).nullable().optional(),
  frequencyType: z.enum(FREQUENCY_TYPES).optional(),
  frequencyDays: z
    .string()
    .regex(/^([0-6](,[0-6])*)?$/, "frequencyDays must be comma-separated digits (0-6)")
    .nullable()
    .optional(),
  targetPerDay: z.number().int().min(1, "targetPerDay must be at least 1").optional(),
  unit: z.string().max(30).nullable().optional(),
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "reminderTime must be in HH:mm format")
    .nullable()
    .optional(),
  isArchived: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;

export const reorderHabitsSchema = z.object({
  habitIds: z.array(z.string().min(1)).min(1, "habitIds cannot be empty"),
});

export type ReorderHabitsInput = z.infer<typeof reorderHabitsSchema>;
