import "server-only";

import { verifySession } from "./auth";
import type { InvoiceDefaults } from "./invoice";

export async function getInvoiceDefaults(): Promise<InvoiceDefaults> {
  await verifySession();
  return {
    notes: (process.env.INVOICE_DEFAULT_NOTES ?? "").replaceAll("\\n", "\n"),
    signature: process.env.INVOICE_DEFAULT_SIGNATURE ?? "",
    signatory: process.env.INVOICE_DEFAULT_SIGNATORY ?? "",
  };
}
