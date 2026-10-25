import { z } from "zod";
import { THEME_PREFERENCES } from "@/lib/constants";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .trim()
    .optional(),
  timezone: z.string().min(1).max(100).optional(),
  theme: z.enum(THEME_PREFERENCES).optional(),
  weekStartsOn: z.union([z.literal(0), z.literal(1)]).optional(),
  avatarColor: z.string().max(30).nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long")
    .max(100),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
