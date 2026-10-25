import { describe, it, expect } from "vitest";
import { validateEnv } from "@/lib/env";

describe("Environment Variable Validation", () => {
  it("should validate default environment variables successfully", () => {
    const rawEnv = {
      NODE_ENV: "development",
      DATABASE_URL: "file:./dev.db",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      AUTH_SECRET: "daily-track-secure-auth-secret-key-must-be-32-chars-long!",
    };

    const parsed = validateEnv(rawEnv);
    expect(parsed.NODE_ENV).toBe("development");
    expect(parsed.DATABASE_URL).toBe("file:./dev.db");
    expect(parsed.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(parsed.AUTH_SECRET).toBe(
      "daily-track-secure-auth-secret-key-must-be-32-chars-long!"
    );
  });

  it("should fall back to defaults when optional env vars are omitted", () => {
    const parsed = validateEnv({});
    expect(parsed.NODE_ENV).toBe("development");
    expect(parsed.DATABASE_URL).toBe("file:./dev.db");
    expect(parsed.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(parsed.AUTH_SECRET.length).toBeGreaterThanOrEqual(32);
  });

  it("should fail validation if NODE_ENV has an invalid value", () => {
    expect(() => {
      validateEnv({ NODE_ENV: "staging" as unknown as "development" });
    }).toThrow();
  });

  it("should fail validation if NEXT_PUBLIC_APP_URL is not a valid URL", () => {
    expect(() => {
      validateEnv({ NEXT_PUBLIC_APP_URL: "not-a-valid-url" });
    }).toThrow();
  });

  it("should fail validation if AUTH_SECRET is shorter than 32 characters", () => {
    expect(() => {
      validateEnv({ AUTH_SECRET: "too-short-secret" });
    }).toThrow();
  });
});
