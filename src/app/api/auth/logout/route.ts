import { apiSuccess } from "@/server/utils/response";
import { getSessionCookieOptions } from "@/server/auth/session";

export async function POST() {
  const response = apiSuccess({ message: "Logged out successfully" }, 200);

  response.cookies.set({
    ...getSessionCookieOptions(),
    value: "",
    maxAge: 0,
  });

  return response;
}
