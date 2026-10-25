import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { GoalsService } from "@/server/services/goals.service";
import { createGoalSchema } from "@/server/validators/goal.schema";
import { apiSuccess, apiError } from "@/server/utils/response";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { searchParams } = request.nextUrl;
  const statusParam = searchParams.get("status");

  const goals = await GoalsService.listGoals(user.id, statusParam || undefined);
  return apiSuccess(goals, 200);
}

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

  const result = createGoalSchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  const goal = await GoalsService.createGoal(user.id, result.data);
  return apiSuccess(goal, 201);
}
