import type { Metadata } from "next";
import { Suspense } from "react";
import { BackLink } from "@/components/back-link";
import { EditInvoiceEditor } from "@/components/invoice/invoice-editor";
import { PageHeading } from "@/components/page-heading";
import { StatusCard } from "@/components/ui/status-card";

export const metadata: Metadata = {
  title: "Edit Invoice",
};

export default function EditInvoicePage({ params }: PageProps<"/invoices/[id]/edit">) {
  return (
    <main className="page-container flex flex-col gap-6 py-10">
      <div className="flex flex-col items-start gap-3">
        <BackLink />
        <PageHeading title="Edit Invoice" description="Perbaiki detail invoice lalu simpan perubahan." />
      </div>
      <Suspense fallback={<StatusCard>Memuat invoice...</StatusCard>}>
        {params.then(({ id }) => (
          <EditInvoiceEditor id={id} />
        ))}
      </Suspense>
    </main>
  );
}
