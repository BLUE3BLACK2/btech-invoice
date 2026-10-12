import type { Metadata } from "next";
import { Suspense } from "react";
import { BackLink } from "@/components/back-link";
import { InvoicePreview } from "@/components/invoice/invoice-preview";
import { StatusCard } from "@/components/ui/status-card";

export const metadata: Metadata = {
  title: "Preview Invoice",
};

export default function InvoicePage({ params }: PageProps<"/invoices/[id]">) {
  return (
    <main className="page-container flex flex-col gap-6 py-10">
      <BackLink />
      <Suspense fallback={<StatusCard>Memuat invoice...</StatusCard>}>
        {params.then(({ id }) => (
          <InvoicePreview id={id} />
        ))}
      </Suspense>
    </main>
  );
}
