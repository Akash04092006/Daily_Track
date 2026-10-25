import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { ProfileService } from "@/server/services/profile.service";
import { changePasswordSchema } from "@/server/validators/profile.schema";
import { apiSuccess, apiError } from "@/server/utils/response";

export async function POST(request: NextRequest) {
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

  const result = changePasswordSchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  const resultStatus = await ProfileService.changePassword(user.id, result.data);
  if (!resultStatus.success) {
    return apiError("INVALID_PASSWORD", resultStatus.message, null, 400);
  }

  return apiSuccess({ message: resultStatus.message }, 200);
}
