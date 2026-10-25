import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { GoalsService } from "@/server/services/goals.service";
import { createMilestoneSchema } from "@/server/validators/goal.schema";
import { apiSuccess, apiError } from "@/server/utils/response";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { id: goalId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Malformed JSON request body", null, 400);
  }

  const result = createMilestoneSchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  const milestone = await GoalsService.createMilestone(user.id, goalId, result.data);
  if (!milestone) {
    return apiError("NOT_FOUND", "Goal not found", null, 404);
  }

  return apiSuccess(milestone, 201);
}
