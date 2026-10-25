import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import type { SignupInput, LoginInput } from "@/server/validators/auth.schema";
import type { SafeUser } from "@/server/auth/current-user";

export class AuthService {
  /**
   * Registers a new user. Throws if email is already taken.
   */
  static async signup(input: SignupInput): Promise<SafeUser> {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      const error = new Error("An account with this email already exists");
      (error as unknown as { code: string }).code = "CONFLICT";
      throw error;
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        timezone: input.timezone || "Asia/Kolkata",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Verifies credentials and returns user if valid.
   */
  static async login(input: LoginInput): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(input.password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Retrieves user profile by ID without password hash.
   */
  static async getMe(userId: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
