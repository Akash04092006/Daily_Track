import { getCurrentUser } from "@/server/auth/current-user";
import { StatsService } from "@/server/services/stats.service";
import { apiSuccess, apiError } from "@/server/utils/response";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const summary = await StatsService.getSummary(user.id);
  return apiSuccess(summary, 200);
}
