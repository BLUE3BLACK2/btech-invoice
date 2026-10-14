"use client";

import { unstable_rethrow } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getInvoiceAction } from "@/app/(app)/invoices/actions";
import type { Invoice } from "@/lib/invoice";
import { downloadInvoicePdf, renderInvoicePdf } from "@/lib/invoice-pdf";

type InvoicePdf = { invoice: Invoice } & ({ blob: Blob } | { failed: true });

export function useInvoicePdf(invoice: Invoice | undefined) {
  const [pdf, setPdf] = useState<InvoicePdf | null>(null);

  useEffect(() => {
    if (!invoice) return;
    let active = true;
    renderInvoicePdf(invoice)
      .then((blob) => {
        if (active) setPdf({ invoice, blob });
      })
      .catch(() => {
        if (active) setPdf({ invoice, failed: true });
      });
    return () => {
      active = false;
    };
  }, [invoice]);

  return pdf?.invoice === invoice ? pdf : null;
}

export function useInvoicePdfDownload() {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  const download = useCallback(async (source: Invoice | number) => {
    setPendingId(typeof source === "number" ? source : source.id);
    setFailed(false);
    try {
      const invoice = typeof source === "number" ? await getInvoiceAction(source) : source;
      if (invoice) downloadInvoicePdf(invoice, await renderInvoicePdf(invoice));
      else setFailed(true);
    } catch (error) {
      unstable_rethrow(error);
      setFailed(true);
    } finally {
      setPendingId(null);
    }
  }, []);

  return { download, pendingId, failed };
}
