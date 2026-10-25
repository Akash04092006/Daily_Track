import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { DailyEntriesService } from "@/server/services/daily-entries.service";
import { getDailyEntriesQuerySchema } from "@/server/validators/daily-entry.schema";
import { apiSuccess, apiError } from "@/server/utils/response";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { searchParams } = request.nextUrl;
  const queryParams = {
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
  };

  const result = getDailyEntriesQuerySchema.safeParse(queryParams);
  if (!result.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid query parameters",
      result.error.format(),
      422
    );
  }

  const entries = await DailyEntriesService.getEntries(
    user.id,
    result.data.from,
    result.data.to
  );

  return apiSuccess(entries, 200);
}
