import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { HabitLogsService } from "@/server/services/habit-logs.service";
import { getHabitLogsQuerySchema } from "@/server/validators/habit-log.schema";
import { apiSuccess, apiError } from "@/server/utils/response";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { searchParams } = request.nextUrl;
  const queryParams = {
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    habitId: searchParams.get("habitId") || undefined,
  };

  const result = getHabitLogsQuerySchema.safeParse(queryParams);
  if (!result.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid query parameters",
      result.error.format(),
      422
    );
  }

  const logs = await HabitLogsService.getLogs(
    user.id,
    result.data.from,
    result.data.to,
    result.data.habitId
  );

  return apiSuccess(logs, 200);
}
