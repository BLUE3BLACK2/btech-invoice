import type { Metadata } from "next";
import { Suspense } from "react";
import { BackLink } from "@/components/back-link";
import { InvoiceNotFound } from "@/components/invoice/invoice-not-found";
import { InvoicePreview } from "@/components/invoice/invoice-preview";
import { StatusCard } from "@/components/ui/status-card";
import { getInvoice } from "@/lib/invoice-store";

export const metadata: Metadata = {
  title: "Preview Invoice",
};

async function Preview({ id }: { id: string }) {
  const invoice = await getInvoice(id);
  return invoice ? <InvoicePreview invoice={invoice} /> : <InvoiceNotFound />;
}

export default function InvoicePage({ params }: PageProps<"/invoices/[id]">) {
  return (
    <main className="page-container flex flex-col gap-6 py-10">
      <BackLink />
      <Suspense fallback={<StatusCard>Memuat invoice...</StatusCard>}>
        {params.then(({ id }) => (
          <Preview id={id} />
        ))}
      </Suspense>
    </main>
  );
}
