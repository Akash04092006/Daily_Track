import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required").default("file:./dev.db"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters long")
    .default("daily-track-secure-auth-secret-key-must-be-32-chars-long!"),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(
  rawEnv: Record<string, string | undefined> = process.env
): Env {
  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const formattedErrors = JSON.stringify(result.error.format(), null, 2);
    console.error("❌ Invalid environment variables:\n", formattedErrors);
    throw new Error(`Environment validation failed:\n${formattedErrors}`);
  }

  return result.data;
}

export const env = validateEnv();
