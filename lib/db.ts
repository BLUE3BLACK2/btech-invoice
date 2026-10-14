import "server-only";

import postgres from "postgres";

const globalForDb = globalThis as typeof globalThis & { sql?: postgres.Sql };

export const sql =
  globalForDb.sql ??
  postgres(process.env.DATABASE_URL ?? "", {
    transform: postgres.camel,
    max: 5,
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;

export function isUniqueViolation(error: unknown) {
  return error instanceof postgres.PostgresError && error.code === "23505";
}
