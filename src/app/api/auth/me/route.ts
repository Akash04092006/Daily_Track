import { getCurrentUser } from "@/server/auth/current-user";
import { apiSuccess, apiError } from "@/server/utils/response";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  return apiSuccess(user, 200);
}
