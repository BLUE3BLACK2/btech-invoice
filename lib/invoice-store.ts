import "server-only";

import { verifySession } from "./auth";
import { sql } from "./db";
import type { Invoice, InvoiceSummary } from "./invoice";

const MAX_ID = 2147483647;

function parseId(id: string | number) {
  const value = Number(id);
  return Number.isSafeInteger(value) && value > 0 && value <= MAX_ID ? value : null;
}

function invoiceRow(invoice: Invoice) {
  return {
    number: invoice.number,
    logo: invoice.logo,
    companyName: invoice.companyName,
    billTo: invoice.billTo,
    billToDetails: invoice.billToDetails,
    date: invoice.date,
    dueDate: invoice.dueDate,
    currency: invoice.currency,
    items: sql.json(invoice.items),
    taxRate: invoice.taxRate,
    notes: invoice.notes,
    terms: invoice.terms,
    signature: invoice.signature,
    signatory: invoice.signatory,
  };
}

export async function listInvoices() {
  await verifySession();
  return sql<InvoiceSummary[]>`
    SELECT id, number, bill_to, date::text AS date, currency, items, tax_rate
    FROM invoices
    ORDER BY id DESC
  `;
}

export async function getInvoice(id: string | number) {
  await verifySession();
  const invoiceId = parseId(id);
  if (!invoiceId) return null;
  const [invoice] = await sql<Invoice[]>`
    SELECT id, number, logo, company_name, bill_to, bill_to_details, date::text AS date,
      due_date::text AS due_date, currency, items, tax_rate, notes, terms, signature, signatory
    FROM invoices
    WHERE id = ${invoiceId}
  `;
  return invoice ?? null;
}

export async function listInvoiceNumbers() {
  await verifySession();
  const rows = await sql<Pick<Invoice, "number">[]>`SELECT number FROM invoices ORDER BY id DESC`;
  return rows.map((row) => row.number);
}

export async function getLatestInvoice() {
  await verifySession();
  const [invoice] = await sql<Pick<Invoice, "notes" | "signature" | "signatory">[]>`
    SELECT notes, signature, signatory FROM invoices ORDER BY id DESC LIMIT 1
  `;
  return invoice ?? null;
}

export async function insertInvoice(invoice: Invoice, createdAt?: string) {
  await verifySession();
  const row = { ...invoiceRow(invoice), createdAt: createdAt ?? new Date().toISOString() };
  const [inserted] = await sql<Pick<Invoice, "id">[]>`
    INSERT INTO invoices ${sql(row)}
    ON CONFLICT (number) DO NOTHING
    RETURNING id
  `;
  return inserted?.id ?? null;
}

export async function updateInvoice(invoice: Invoice) {
  await verifySession();
  const [updated] = await sql<Pick<Invoice, "id">[]>`
    UPDATE invoices SET ${sql(invoiceRow(invoice))}, updated_at = now()
    WHERE id = ${invoice.id}
    RETURNING id
  `;
  return updated?.id ?? null;
}

export async function deleteInvoice(id: number) {
  await verifySession();
  const invoiceId = parseId(id);
  if (invoiceId) await sql`DELETE FROM invoices WHERE id = ${invoiceId}`;
}
