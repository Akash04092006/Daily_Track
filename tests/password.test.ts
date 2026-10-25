import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/server/auth/password";

describe("Password Hashing & Verification (bcryptjs)", () => {
  it("should securely hash a plaintext password and verify correctly", async () => {
    const plaintext = "SuperSecretPassword123!";
    const hash = await hashPassword(plaintext);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(plaintext);
    expect(hash.startsWith("$2")).toBe(true);

    const isValid = await verifyPassword(plaintext, hash);
    expect(isValid).toBe(true);
  });

  it("should fail verification for incorrect password", async () => {
    const hash = await hashPassword("CorrectPassword123!");
    const isValid = await verifyPassword("WrongPassword!", hash);
    expect(isValid).toBe(false);
  });

  it("should generate distinct salt hashes for the same password", async () => {
    const password = "IdenticalPassword999";
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
    expect(await verifyPassword(password, hash1)).toBe(true);
    expect(await verifyPassword(password, hash2)).toBe(true);
  });
});
