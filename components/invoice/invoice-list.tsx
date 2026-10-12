"use client";

import { Download, FileText, LoaderCircle, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInvoicePdfDownload } from "@/hooks/use-invoice-pdf";
import { useInvoices } from "@/hooks/use-invoices";
import { calculateTotals, formatCurrency, formatDate } from "@/lib/invoice";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusCard } from "@/components/ui/status-card";

const columns = ["Nomor", "Bill To", "Tanggal", "Total"];

export function InvoiceList() {
  const router = useRouter();
  const { invoices, deleteInvoice } = useInvoices();
  const { download, pendingId, failed } = useInvoicePdfDownload();

  if (!invoices) {
    return <StatusCard>Memuat invoice...</StatusCard>;
  }

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Belum ada invoice"
        description="Klik Tambah Invoice untuk membuat invoice pertama."
      />
    );
  }

  const sorted = [...invoices].sort((a, b) => b.number.localeCompare(a.number));

  function handleDelete(id: string, number: string) {
    if (window.confirm(`Hapus invoice ${number}?`)) deleteInvoice(id);
  }

  return (
    <div className="flex flex-col gap-3">
      {failed && <p className="text-sm text-danger">PDF gagal dibuat. Coba lagi.</p>}
      <Card className="relative overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wide text-muted uppercase">
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className={column === "Total" ? "px-6 py-4 text-right font-semibold" : "px-6 py-4 font-semibold"}
                >
                  {column}
                </th>
              ))}
              <th scope="col" className="w-36 px-6 py-4">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((invoice) => (
              <tr
                key={invoice.id}
                className="cursor-pointer border-b border-border last:border-0 hover:bg-canvas"
                onClick={() => router.push(`/invoices/${invoice.id}`)}
              >
                <td className="px-6 py-4 font-semibold text-primary">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {invoice.number}
                  </Link>
                </td>
                <td className="px-6 py-4 font-medium">{invoice.billTo}</td>
                <td className="px-6 py-4 text-muted">{formatDate(invoice.date)}</td>
                <td className="px-6 py-4 text-right font-medium tabular-nums">
                  {formatCurrency(calculateTotals(invoice).total, invoice.currency)}
                </td>
                <td className="px-4 py-2" onClick={(event) => event.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Download PDF invoice ${invoice.number}`}
                      disabled={pendingId !== null}
                      onClick={() => download(invoice)}
                    >
                      {pendingId === invoice.id ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Download className="size-4" />
                      )}
                    </Button>
                    <ButtonLink
                      href={`/invoices/${invoice.id}/edit`}
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit invoice ${invoice.number}`}
                    >
                      <Pencil className="size-4" />
                    </ButtonLink>
                    <Button
                      variant="danger"
                      size="icon"
                      aria-label={`Hapus invoice ${invoice.number}`}
                      onClick={() => handleDelete(invoice.id, invoice.number)}
                    >
                      <Trash className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
