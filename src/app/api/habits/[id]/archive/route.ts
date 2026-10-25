import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { HabitsService } from "@/server/services/habits.service";
import { apiSuccess, apiError } from "@/server/utils/response";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { id } = await params;

  let archive = true;
  try {
    const body = await request.json();
    if (typeof body?.archive === "boolean") {
      archive = body.archive;
    }
  } catch {
    // Empty body defaults to archive: true
  }

  const updated = await HabitsService.archiveHabit(user.id, id, archive);
  if (!updated) {
    return apiError("NOT_FOUND", "Habit not found", null, 404);
  }

  return apiSuccess(updated, 200);
}
