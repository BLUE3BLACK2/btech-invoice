import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function BackLink() {
  return (
    <ButtonLink href="/" variant="ghost" size="sm" className="-ml-3 self-start">
      <ArrowLeft className="size-4" />
      Kembali ke daftar
    </ButtonLink>
  );
}
