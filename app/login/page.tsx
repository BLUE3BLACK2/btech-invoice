import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";
import logo from "@/public/images/btech-logo-purple.webp";

export const metadata: Metadata = {
  title: "Masuk",
};

export default function LoginPage() {
  return (
    <main className="page-container flex flex-1 items-center justify-center py-10">
      <Card className="flex w-full max-w-sm flex-col gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <Image src={logo} alt="BTECH" priority className="h-8 w-auto self-start" />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Masuk</h1>
            <p className="text-sm text-muted">Masuk untuk membuat dan mengelola invoice.</p>
          </div>
        </div>
        <LoginForm />
      </Card>
    </main>
  );
}
