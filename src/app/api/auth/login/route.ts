import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { loginSchema } from "@/server/validators/auth.schema";
import { createSessionToken, getSessionCookieOptions } from "@/server/auth/session";
import { checkRateLimit, getClientIp } from "@/server/auth/rate-limit";
import { apiSuccess, apiError } from "@/server/utils/response";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(`login:${ip}`, 5, 60 * 1000);

  if (!rateLimit.allowed) {
    return apiError(
      "RATE_LIMIT_EXCEEDED",
      "Too many login attempts. Please try again later.",
      { retryAfterMs: rateLimit.resetInMs },
      429
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Malformed JSON request body", null, 400);
  }

  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  try {
    const user = await AuthService.login(result.data);
    if (!user) {
      return apiError("INVALID_CREDENTIALS", "Invalid email or password", null, 401);
    }

    const token = await createSessionToken({ userId: user.id, email: user.email });

    const response = apiSuccess(user, 200);
    response.cookies.set({
      ...getSessionCookieOptions(),
      value: token,
    });

    return response;
  } catch (err: unknown) {
    console.error("Login error:", err);
    return apiError(
      "INTERNAL_ERROR",
      "An unexpected error occurred during login",
      null,
      500
    );
  }
}
