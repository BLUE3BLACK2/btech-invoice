import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { InvoiceEditor } from "@/components/invoice/invoice-editor";
import { PageHeading } from "@/components/page-heading";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Invoice Baru",
};

export default function NewInvoicePage() {
  return (
    <main className="page-container flex flex-col gap-6 py-10">
      <div className="flex flex-col items-start gap-3">
        <ButtonLink href="/" variant="ghost" size="sm" className="-ml-3">
          <ArrowLeft className="size-4" />
          Kembali ke daftar
        </ButtonLink>
        <PageHeading title="Invoice Baru" description="Lengkapi detail invoice lalu simpan." />
      </div>
      <InvoiceEditor />
    </main>
  );
}
