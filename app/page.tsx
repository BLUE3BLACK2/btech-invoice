import { Plus } from "lucide-react";
import { InvoiceList } from "@/components/invoice/invoice-list";
import { PageHeading } from "@/components/page-heading";
import { ButtonLink } from "@/components/ui/button";

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
      <InvoiceList />
    </main>
  );
}
