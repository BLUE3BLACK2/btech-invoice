import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";
import { InvoiceEditor } from "@/components/invoice/invoice-editor";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Invoice Baru",
};

export default function NewInvoicePage() {
  return (
    <main className="page-container flex flex-col gap-6 py-10">
      <div className="flex flex-col items-start gap-3">
        <BackLink />
        <PageHeading title="Invoice Baru" description="Lengkapi detail invoice lalu simpan." />
      </div>
      <InvoiceEditor />
    </main>
  );
}
