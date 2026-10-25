import { getCurrentUser } from "@/server/auth/current-user";
import { TodayService } from "@/server/services/today.service";
import { apiSuccess, apiError } from "@/server/utils/response";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const todayView = await TodayService.getTodayView(user.id);
  if (!todayView) {
    return apiError("NOT_FOUND", "User profile not found", null, 404);
  }

  return apiSuccess(todayView, 200);
}
