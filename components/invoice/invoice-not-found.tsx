import { FileX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function InvoiceNotFound() {
  return (
    <EmptyState
      icon={FileX}
      title="Invoice tidak ditemukan"
      description="Invoice mungkin sudah dihapus atau disimpan di browser lain."
      action={<ButtonLink href="/">Lihat daftar invoice</ButtonLink>}
    />
  );
}
