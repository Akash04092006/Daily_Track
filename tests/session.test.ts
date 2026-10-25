import { describe, it, expect } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/server/auth/session";

describe("Session Management & JWT Tokens (jose)", () => {
  it("should create and verify a signed session token successfully", async () => {
    const payload = {
      userId: "user_test_12345",
      email: "test@example.com",
    };

    const token = await createSessionToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // Header.Payload.Signature

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.email).toBe(payload.email);
  });

  it("should return null when verifying a malformed or tampered token", async () => {
    const validToken = await createSessionToken({
      userId: "u123",
      email: "u123@example.com",
    });

    // Tamper with the payload part
    const parts = validToken.split(".");
    const tamperedToken = `${parts[0]}.${parts[1]}tampered.${parts[2]}`;

    const verified = await verifySessionToken(tamperedToken);
    expect(verified).toBeNull();
  });

  it("should return null for completely random token strings", async () => {
    const verified = await verifySessionToken("not-a-real-jwt-token");
    expect(verified).toBeNull();
  });

  it("should return standard HTTP-only session cookie options", () => {
    const options = getSessionCookieOptions();
    expect(options.name).toBe(SESSION_COOKIE_NAME);
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.path).toBe("/");
    expect(options.maxAge).toBe(7 * 24 * 60 * 60);
  });
});
