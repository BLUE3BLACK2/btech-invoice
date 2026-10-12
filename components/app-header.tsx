import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/btech-logo-purple.webp";

export function AppHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="page-container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image src={logo} alt="BTECH" priority className="h-6 w-auto" />
          <span className="border-l border-border pl-3 text-sm font-medium text-muted">
            Invoice
          </span>
        </Link>
      </div>
    </header>
  );
}
