import { Plus } from "lucide-react";
import { Suspense } from "react";
import { InvoiceList } from "@/components/invoice/invoice-list";
import { LocalInvoiceImport } from "@/components/invoice/local-invoice-import";
import { PageHeading } from "@/components/page-heading";
import { ButtonLink } from "@/components/ui/button";
import { StatusCard } from "@/components/ui/status-card";
import { listInvoices } from "@/lib/invoice-store";

async function Invoices() {
  return <InvoiceList invoices={await listInvoices()} />;
}

export default function Home() {
  return (
    <main className="page-container flex flex-col gap-6 py-10">
      <PageHeading
        title="Daftar Invoice"
        description="Semua invoice yang sudah dibuat untuk klien BTECH."
        actions={
          <ButtonLink href="/invoices/new">
            <Plus className="size-4" />
            Tambah Invoice
          </ButtonLink>
        }
      />
      <LocalInvoiceImport />
      <Suspense fallback={<StatusCard>Memuat invoice...</StatusCard>}>
        <Invoices />
      </Suspense>
    </main>
  );
}
