"use client";

import { useCallback, useEffect, useState } from "react";
import type { Invoice } from "@/lib/invoice";
import { downloadInvoicePdf, renderInvoicePdf } from "@/lib/invoice-pdf";

type InvoicePdf = { invoice: Invoice } & ({ blob: Blob; url: string } | { failed: true });

export function useInvoicePdf(invoice: Invoice | undefined) {
  const [pdf, setPdf] = useState<InvoicePdf | null>(null);

  useEffect(() => {
    if (!invoice) return;
    let active = true;
    let url = "";
    renderInvoicePdf(invoice)
      .then((blob) => {
        if (!active) return;
        url = URL.createObjectURL(blob);
        setPdf({ invoice, blob, url });
      })
      .catch(() => {
        if (active) setPdf({ invoice, failed: true });
      });
    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [invoice]);

  return pdf?.invoice === invoice ? pdf : null;
}

export function useInvoicePdfDownload() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const download = useCallback(async (invoice: Invoice) => {
    setPendingId(invoice.id);
    setFailed(false);
    try {
      downloadInvoicePdf(invoice, await renderInvoicePdf(invoice));
    } catch {
      setFailed(true);
    } finally {
      setPendingId(null);
    }
  }, []);

  return { download, pendingId, failed };
}
