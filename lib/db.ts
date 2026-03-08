import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/shared/schema";

// For Vercel builds, we need to handle missing DATABASE_URL gracefully
// The database will only be initialized when actually accessed at runtime
let poolInstance: Pool | undefined;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

function initializeDb() {
  if (!dbInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set");
    }
    poolInstance = new Pool({ connectionString: process.env.DATABASE_URL });
    dbInstance = drizzle(poolInstance, { schema });
  }
  return { db: dbInstance, pool: poolInstance };
}

// Export getter functions for explicit initialization
export function getDb() {
  return initializeDb().db;
}

export function getPool() {
  return initializeDb().pool;
}

// Export lazy-loaded db - throws only when actually used
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(target, prop) {
    const { db } = initializeDb();
    return db[prop as keyof typeof db];
  },
});

export const pool = new Proxy({} as Pool, {
  get(target, prop) {
    const { pool } = initializeDb();
    if (!pool) {
      throw new Error("Pool initialization failed");
    }
    return pool[prop as keyof Pool];
  },
});
