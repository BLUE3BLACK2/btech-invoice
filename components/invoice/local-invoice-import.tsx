"use client";

import { DatabaseBackup, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { importInvoiceAction } from "@/app/(app)/invoices/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STORAGE_KEY = "btech-invoice:invoices";

function readStoredInvoices() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribe() {
  return () => {};
}

function parseStoredInvoices(raw: string | null): unknown[] {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function LocalInvoiceImport() {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, readStoredInvoices, () => null);
  const invoices = useMemo(() => parseStoredInvoices(raw), [raw]);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [importing, startImporting] = useTransition();

  if (done || invoices.length === 0) return null;

  function handleImport() {
    setFailed(false);
    startImporting(async () => {
      let imported = true;
      for (const invoice of invoices) {
        imported = (await importInvoiceAction(invoice).catch(() => false)) && imported;
      }
      if (!imported) {
        setFailed(true);
        return;
      }
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      setDone(true);
      router.refresh();
    });
  }

  return (
    <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold">Ada {invoices.length} invoice tersimpan di browser ini</h2>
        <p className="text-sm text-muted">
          Pindahkan ke database supaya bisa dibuka dari perangkat lain. Nomor yang sudah ada di
          database dilewati.
        </p>
        {failed && (
          <p className="text-sm text-danger">Sebagian invoice gagal dipindahkan. Coba lagi.</p>
        )}
      </div>
      <Button variant="secondary" disabled={importing} onClick={handleImport}>
        {importing ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <DatabaseBackup className="size-4" />
        )}
        Pindahkan ke Database
      </Button>
    </Card>
  );
}
