import "server-only";

import { nextInvoiceNumber, type InvoiceDefaults } from "./invoice";
import { getLatestInvoice, listInvoiceNumbers } from "./invoice-store";

export async function getInvoiceDefaults(): Promise<InvoiceDefaults> {
  const [numbers, latest] = await Promise.all([listInvoiceNumbers(), getLatestInvoice()]);
  return {
    number: nextInvoiceNumber(numbers),
    notes:
      (process.env.INVOICE_DEFAULT_NOTES ?? "").replaceAll("\n", "\n") || latest?.notes || "",
    signature: process.env.INVOICE_DEFAULT_SIGNATURE || latest?.signature || "",
    signatory: process.env.INVOICE_DEFAULT_SIGNATORY || latest?.signatory || "",
  };
}
