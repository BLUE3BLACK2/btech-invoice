"use client";

import { Download, Pencil } from "lucide-react";
import { useInvoicePdf } from "@/hooks/use-invoice-pdf";
import { useInvoices } from "@/hooks/use-invoices";
import {
  calculateTotals,
  formatCurrency,
  formatDate,
  invoiceTitle,
  type Invoice,
} from "@/lib/invoice";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";
import { PageHeading } from "@/components/page-heading";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusCard } from "@/components/ui/status-card";
import { InvoiceNotFound } from "./invoice-not-found";
import { SummaryRow } from "./invoice-summary";
import { PdfPages } from "./pdf-pages";

function InvoicePdfPreview({ invoice }: { invoice: Invoice }) {
  const pdf = useInvoicePdf(invoice);
  const ready = pdf && "blob" in pdf ? pdf : null;
  const totals = calculateTotals(invoice);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={invoiceTitle(invoice)}
        description={`Ditagihkan ke ${invoice.billTo}`}
      />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <Card className="overflow-hidden">
          <PdfPages
            blob={ready?.blob ?? null}
            failed={Boolean(pdf) && !ready}
            label={`Preview ${invoiceTitle(invoice)}`}
          />
        </Card>

        <aside className="order-first flex flex-col gap-6 lg:sticky lg:top-6 lg:order-none">
          <div className="flex flex-col gap-3">
            <Button
              block
              disabled={!ready}
              onClick={() => ready && downloadInvoicePdf(invoice, ready.blob)}
            >
              <Download className="size-4" />
              Download PDF
            </Button>
            <ButtonLink href={`/invoices/${invoice.id}/edit`} variant="secondary" block>
              <Pencil className="size-4" />
              Edit Invoice
            </ButtonLink>
          </div>
          <Card className="p-6">
            <dl className="flex flex-col gap-4 text-sm">
              <SummaryRow label="Bill To">{invoice.billTo}</SummaryRow>
              <SummaryRow label="Date">{formatDate(invoice.date)}</SummaryRow>
              <SummaryRow label="Due Date">{formatDate(invoice.dueDate)}</SummaryRow>
              <SummaryRow label="Total" emphasis="total">
                {formatCurrency(totals.total, invoice.currency)}
              </SummaryRow>
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export function InvoicePreview({ id }: { id: string }) {
  const { invoices } = useInvoices();

  if (!invoices) {
    return <StatusCard>Memuat invoice...</StatusCard>;
  }

  const invoice = invoices.find((item) => item.id === id);

  if (!invoice) {
    return <InvoiceNotFound />;
  }

  return <InvoicePdfPreview invoice={invoice} />;
}
