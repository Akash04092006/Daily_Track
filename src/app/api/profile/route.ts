import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { ProfileService } from "@/server/services/profile.service";
import { updateProfileSchema } from "@/server/validators/profile.schema";
import { apiSuccess, apiError } from "@/server/utils/response";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const profile = await ProfileService.getProfile(user.id);
  if (!profile) {
    return apiError("NOT_FOUND", "Profile not found", null, 404);
  }

  return apiSuccess(profile, 200);
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Malformed JSON request body", null, 400);
  }

  const result = updateProfileSchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  const updated = await ProfileService.updateProfile(user.id, result.data);
  if (!updated) {
    return apiError("NOT_FOUND", "Profile not found", null, 404);
  }

  return apiSuccess(updated, 200);
}
