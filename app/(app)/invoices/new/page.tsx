import type { Metadata } from "next";
import { Suspense } from "react";
import { BackLink } from "@/components/back-link";
import { InvoiceEditor } from "@/components/invoice/invoice-editor";
import { PageHeading } from "@/components/page-heading";
import { StatusCard } from "@/components/ui/status-card";
import { getInvoiceDefaults } from "@/lib/invoice-defaults";

export const metadata: Metadata = {
  title: "Invoice Baru",
};

async function NewInvoiceEditor() {
  return <InvoiceEditor defaults={await getInvoiceDefaults()} />;
}

export default function NewInvoicePage() {
  return (
    <main className="page-container flex flex-col gap-6 py-10">
      <div className="flex flex-col items-start gap-3">
        <BackLink />
        <PageHeading title="Invoice Baru" description="Lengkapi detail invoice lalu simpan." />
      </div>
      <Suspense fallback={<StatusCard>Menyiapkan invoice...</StatusCard>}>
        <NewInvoiceEditor />
      </Suspense>
    </main>
  );
}
