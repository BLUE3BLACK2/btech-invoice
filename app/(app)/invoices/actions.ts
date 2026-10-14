"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { saveClient } from "@/lib/client-store";
import { isUniqueViolation } from "@/lib/db";
import { parseInvoice, validateInvoice, type Invoice, type InvoiceErrors } from "@/lib/invoice";
import { deleteInvoice, getInvoice, insertInvoice, updateInvoice } from "@/lib/invoice-store";

const DUPLICATE_NUMBER: InvoiceErrors = { number: "Nomor invoice sudah dipakai." };

export async function saveInvoiceAction(input: Invoice): Promise<InvoiceErrors> {
  await verifySession();
  const invoice = parseInvoice(input);
  if (!invoice) return { form: "Data invoice tidak valid." };
  const errors = validateInvoice(invoice);
  if (Object.keys(errors).length > 0) return errors;

  let id: number | null;
  try {
    await saveClient({ name: invoice.billTo, details: invoice.billToDetails });
    id = invoice.id ? await updateInvoice(invoice) : await insertInvoice(invoice);
  } catch (error) {
    if (isUniqueViolation(error)) return DUPLICATE_NUMBER;
    return { form: "Invoice gagal disimpan. Coba lagi." };
  }
  if (!id) return invoice.id ? { form: "Invoice tidak ditemukan." } : DUPLICATE_NUMBER;
  redirect(invoice.id ? `/invoices/${id}` : "/");
}

export async function importInvoiceAction(input: unknown) {
  await verifySession();
  const invoice = parseInvoice(input);
  if (!invoice || Object.keys(validateInvoice(invoice)).length > 0) return true;
  const createdAt = (input as { createdAt?: unknown }).createdAt;
  try {
    await saveClient({ name: invoice.billTo, details: invoice.billToDetails });
    await insertInvoice(
      { ...invoice, id: 0 },
      typeof createdAt === "string" && !Number.isNaN(Date.parse(createdAt)) ? createdAt : undefined,
    );
    return true;
  } catch {
    return false;
  }
}

export async function getInvoiceAction(id: number) {
  await verifySession();
  return getInvoice(id);
}

export async function deleteInvoiceAction(id: number) {
  await verifySession();
  await deleteInvoice(id);
  refresh();
}
