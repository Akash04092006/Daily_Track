import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import type {
  UpdateProfileInput,
  ChangePasswordInput,
} from "@/server/validators/profile.schema";
import type { SafeUser } from "@/server/auth/current-user";

export class ProfileService {
  /**
   * Retrieves profile for the authenticated user.
   */
  static async getProfile(userId: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Updates user preferences and profile settings.
   */
  static async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ): Promise<SafeUser | null> {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      return null;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.timezone !== undefined ? { timezone: input.timezone } : {}),
        ...(input.theme !== undefined ? { theme: input.theme } : {}),
        ...(input.weekStartsOn !== undefined ? { weekStartsOn: input.weekStartsOn } : {}),
        ...(input.avatarColor !== undefined ? { avatarColor: input.avatarColor } : {}),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }

  /**
   * Changes the user's password after verifying the current password.
   */
  static async changePassword(
    userId: string,
    input: ChangePasswordInput
  ): Promise<{ success: boolean; message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isValid = await verifyPassword(input.currentPassword, user.passwordHash);
    if (!isValid) {
      return { success: false, message: "Incorrect current password" };
    }

    const newHash = await hashPassword(input.newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { success: true, message: "Password updated successfully" };
  }
}
