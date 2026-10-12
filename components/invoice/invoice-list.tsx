"use client";

import { FileText, Plus, Trash } from "lucide-react";
import { useInvoices } from "@/hooks/use-invoices";
import { calculateTotals, formatCurrency, formatDate } from "@/lib/invoice";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const columns = ["Nomor", "Bill To", "Tanggal", "Total"];

export function InvoiceList() {
  const { invoices, deleteInvoice } = useInvoices();

  if (!invoices) {
    return <Card className="p-10 text-center text-sm text-muted">Memuat invoice...</Card>;
  }

  if (invoices.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <FileText className="size-6" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Belum ada invoice</h2>
          <p className="text-sm text-muted">Buat invoice pertama untuk klien BTECH.</p>
        </div>
        <ButtonLink href="/invoices/new">
          <Plus className="size-4" />
          Tambah Invoice
        </ButtonLink>
      </Card>
    );
  }

  const sorted = [...invoices].sort((a, b) => b.number.localeCompare(a.number));

  function handleDelete(id: string, number: string) {
    if (window.confirm(`Hapus invoice ${number}?`)) deleteInvoice(id);
  }

  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
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
            <th scope="col" className="w-16 px-6 py-4">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((invoice) => (
            <tr key={invoice.id} className="border-b border-border last:border-0 hover:bg-canvas">
              <td className="px-6 py-4 font-semibold text-primary">{invoice.number}</td>
              <td className="px-6 py-4 font-medium">{invoice.billTo}</td>
              <td className="px-6 py-4 text-muted">{formatDate(invoice.date)}</td>
              <td className="px-6 py-4 text-right font-medium tabular-nums">
                {formatCurrency(calculateTotals(invoice).total, invoice.currency)}
              </td>
              <td className="px-4 py-2 text-right">
                <Button
                  variant="danger"
                  size="icon"
                  aria-label={`Hapus invoice ${invoice.number}`}
                  onClick={() => handleDelete(invoice.id, invoice.number)}
                >
                  <Trash className="size-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
