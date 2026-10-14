import "server-only";

import { verifySession } from "./auth";
import { sql } from "./db";
import type { Client } from "./invoice";

export async function listClients() {
  await verifySession();
  return sql<Client[]>`SELECT name, details FROM clients ORDER BY lower(name)`;
}

export async function saveClient(client: Client) {
  await verifySession();
  await sql`
    INSERT INTO clients ${sql(client)}
    ON CONFLICT (name) DO UPDATE SET
      details = CASE WHEN excluded.details = '' THEN clients.details ELSE excluded.details END,
      updated_at = now()
  `;
}
