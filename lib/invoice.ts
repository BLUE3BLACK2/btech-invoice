export const CURRENCIES = ["IDR", "USD", "SGD", "EUR"] as const;

export type Currency = (typeof CURRENCIES)[number];

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

export type Invoice = {
  id: string;
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
  createdAt: string;
};

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
export const DEFAULT_NOTES = [
  `Beneficiary Name: ${DEFAULT_COMPANY_NAME}`,
  "Account Number: ",
  "Bank Name: Bank Mandiri",
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

export function parseAmount(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
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

function parseInvoiceSequence(number: string) {
  const match = new RegExp(`^${INVOICE_PREFIX}(\\d+)$`).exec(number.trim().toUpperCase());
  return match ? Number(match[1]) : 0;
}

export function nextInvoiceNumber(invoices: Invoice[]) {
  const last = invoices.reduce(
    (max, invoice) => Math.max(max, parseInvoiceSequence(invoice.number)),
    0,
  );
  return `${INVOICE_PREFIX}${String(last + 1).padStart(4, "0")}`;
}

export function createLineItem(): LineItem {
  return { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 };
}

export function createInvoice(invoices: Invoice[]): Invoice {
  const today = toIsoDate(new Date());
  return {
    id: crypto.randomUUID(),
    number: nextInvoiceNumber(invoices),
    logo: DEFAULT_LOGO,
    companyName: DEFAULT_COMPANY_NAME,
    billTo: "",
    date: today,
    dueDate: addDays(today, DEFAULT_DUE_DAYS),
    currency: DEFAULT_CURRENCY,
    items: [createLineItem()],
    taxRate: 0,
    notes: DEFAULT_NOTES,
    createdAt: new Date().toISOString(),
  };
}
