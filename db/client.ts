import { DATABASE_URL } from "@/utils/env";
import { PrismaClient } from "./prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = DATABASE_URL;

// Create Neon adapter (uses WebSockets or fetch under the hood, so no pooling issues)
const adapter = new PrismaNeon({ connectionString });

// Prevent multiple instances of Prisma Client in dev (hot reloads)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Attach to global in dev only
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
