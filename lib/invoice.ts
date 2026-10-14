export const CURRENCIES = ["IDR", "USD", "SGD", "EUR"] as const;

export type Currency = (typeof CURRENCIES)[number];

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

export type Invoice = {
  id: number;
  number: string;
  logo: string;
  companyName: string;
  billTo: string;
  date: string;
  dueDate: string;
  currency: Currency;
  items: LineItem[];
  taxRate: number;
  notes: string;
  terms: string;
  signature: string;
  signatory: string;
};

export type InvoiceSummary = Pick<
  Invoice,
  "id" | "number" | "billTo" | "date" | "currency" | "items" | "taxRate"
>;

export type InvoiceDefaults = Pick<Invoice, "number" | "notes" | "signature" | "signatory">;

export type InvoiceErrors = Partial<Record<"number" | "billTo" | "form", string>>;

export type InvoiceTotals = {
  subtotal: number;
  tax: number;
  total: number;
  balanceDue: number;
};

export const INVOICE_PREFIX = "BTECH";
export const DEFAULT_LOGO = "/images/btech-logo-purple.webp";
export const DEFAULT_COMPANY_NAME = "PT SKALA INDONESIA GLOBAL";
export const DEFAULT_CURRENCY: Currency = "IDR";
export const DEFAULT_DUE_DAYS = 14;
const SEQUENCE_DIGITS = 4;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const NUMBERED = /^(.*?)(\d+)$/;
export const NOTES_PLACEHOLDER = [
  "Payment via Mandiri:",
  "Beneficiary Name: ",
  "Account Number: ",
  "Bank Name: ",
].join("\n");
export const DEFAULT_TERMS = [
  "1. Payment is due on or before the due date stated above.",
  "2. Payment is considered complete once funds are fully received in the listed account. Please send proof of transfer.",
  "3. Any bank transfer fees are borne by the payer.",
  "4. Late payment may result in service suspension until payment is received.",
  "5. All payments received are non-refundable.",
].join("\n");

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatCurrency(amount: number, currency: Currency) {
  return `${currency} ${numberFormatter.format(amount)}`;
}

export function formatDate(isoDate: string) {
  if (!isoDate) return "";
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatQuantity(quantity: number) {
  return quantity.toLocaleString("en-US");
}

export function invoiceTitle(invoice: Pick<Invoice, "number">) {
  return `Invoice ${invoice.number}`;
}

export function invoiceFileName(invoice: Pick<Invoice, "number">) {
  return `${invoiceTitle(invoice)}.pdf`;
}

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function parseAmount(value: unknown) {
  const amount = typeof value === "string" ? Number(value) : value;
  return typeof amount === "number" && Number.isFinite(amount) && amount > 0 ? amount : 0;
}

export function lineItemAmount(item: LineItem) {
  return item.quantity * item.rate;
}

export function calculateTotals(invoice: Pick<Invoice, "items" | "taxRate">): InvoiceTotals {
  const subtotal = invoice.items.reduce((sum, item) => sum + lineItemAmount(item), 0);
  const tax = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + tax;
  return { subtotal, tax, total, balanceDue: total };
}

function splitInvoiceNumber(number: string) {
  const match = NUMBERED.exec(number.trim().toUpperCase());
  return match ? { prefix: match[1], digits: match[2] } : null;
}

export function nextInvoiceNumber(numbersNewestFirst: string[]) {
  const parts = numbersNewestFirst.map(splitInvoiceNumber);
  const latest = parts.find((part) => part !== null);
  if (!latest) return `${INVOICE_PREFIX}${"1".padStart(SEQUENCE_DIGITS, "0")}`;
  const last = parts.reduce(
    (max, part) => (part?.prefix === latest.prefix ? Math.max(max, Number(part.digits)) : max),
    0,
  );
  return `${latest.prefix}${String(last + 1).padStart(latest.digits.length, "0")}`;
}

export function createLineItem(): LineItem {
  return { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 };
}

export function createInvoice(defaults: InvoiceDefaults): Invoice {
  const today = toIsoDate(new Date());
  return {
    id: 0,
    logo: DEFAULT_LOGO,
    companyName: DEFAULT_COMPANY_NAME,
    billTo: "",
    date: today,
    dueDate: addDays(today, DEFAULT_DUE_DAYS),
    currency: DEFAULT_CURRENCY,
    items: [createLineItem()],
    taxRate: 0,
    terms: DEFAULT_TERMS,
    ...defaults,
  };
}

export function validateInvoice(invoice: Pick<Invoice, "number" | "billTo">) {
  const errors: InvoiceErrors = {};
  if (!invoice.number) errors.number = "Nomor invoice wajib diisi.";
  if (!invoice.billTo) errors.billTo = "Bill To wajib diisi.";
  return errors;
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function parseLineItem(input: unknown): LineItem {
  const item = (input ?? {}) as Record<string, unknown>;
  return {
    id: text(item.id) || crypto.randomUUID(),
    description: text(item.description),
    quantity: parseAmount(item.quantity),
    rate: parseAmount(item.rate),
  };
}

export function parseInvoice(input: unknown): Invoice | null {
  if (!input || typeof input !== "object") return null;
  const invoice = input as Record<string, unknown>;
  const date = text(invoice.date);
  const dueDate = text(invoice.dueDate);
  if (!ISO_DATE.test(date) || !ISO_DATE.test(dueDate) || !Array.isArray(invoice.items)) {
    return null;
  }
  return {
    id: Number.isSafeInteger(invoice.id) ? Number(invoice.id) : 0,
    number: text(invoice.number).trim().toUpperCase(),
    logo: text(invoice.logo) || DEFAULT_LOGO,
    companyName: text(invoice.companyName),
    billTo: text(invoice.billTo).trim(),
    date,
    dueDate,
    currency: CURRENCIES.find((currency) => currency === invoice.currency) ?? DEFAULT_CURRENCY,
    items: invoice.items.map(parseLineItem),
    taxRate: parseAmount(invoice.taxRate),
    notes: text(invoice.notes),
    terms: text(invoice.terms),
    signature: text(invoice.signature),
    signatory: text(invoice.signatory),
  };
}
