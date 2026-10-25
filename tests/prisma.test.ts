import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Prisma Singleton Client", () => {
  it("should instantiate the Prisma client", () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma).toBe("object");
  });

  it("should maintain a singleton reference across imports", async () => {
    const { prisma: secondaryPrisma } = await import("@/lib/prisma");
    expect(prisma).toBe(secondaryPrisma);
  });
});
