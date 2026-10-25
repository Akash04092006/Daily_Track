import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  name: z.string().min(1, "Name is required").max(100, "Name is too long").trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long"),
  timezone: z.string().optional().default("Asia/Kolkata"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
