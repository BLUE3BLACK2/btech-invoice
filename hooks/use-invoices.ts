"use client";

import { useCallback, useSyncExternalStore } from "react";
import { withInvoiceDefaults, type Invoice } from "@/lib/invoice";

const STORAGE_KEY = "btech-invoice:invoices";
const EMPTY: Invoice[] = [];
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedInvoices: Invoice[] = EMPTY;

function readInvoices() {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedInvoices;
  }
  if (raw === cachedRaw) return cachedInvoices;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : EMPTY;
    cachedInvoices = Array.isArray(parsed) ? parsed.map(withInvoiceDefaults) : EMPTY;
  } catch {
    cachedInvoices = EMPTY;
  }
  return cachedInvoices;
}

function writeInvoices(invoices: Invoice[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch {
    return false;
  }
  listeners.forEach((listener) => listener());
  return true;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot() {
  return null;
}

export function useInvoices() {
  const invoices = useSyncExternalStore(subscribe, readInvoices, getServerSnapshot);

  const saveInvoice = useCallback((invoice: Invoice) => {
    const current = readInvoices();
    const exists = current.some((item) => item.id === invoice.id);
    return writeInvoices(
      exists
        ? current.map((item) => (item.id === invoice.id ? invoice : item))
        : [...current, invoice],
    );
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    return writeInvoices(readInvoices().filter((item) => item.id !== id));
  }, []);

  return { invoices, saveInvoice, deleteInvoice };
}
