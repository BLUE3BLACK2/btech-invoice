"use client";

import { Download, LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useInvoicePdfDownload } from "@/hooks/use-invoice-pdf";
import { useInvoices } from "@/hooks/use-invoices";
import {
  CURRENCIES,
  calculateTotals,
  createInvoice,
  DEFAULT_LOGO,
  NOTES_PLACEHOLDER,
  type Currency,
  type Invoice,
  type InvoiceDefaults,
} from "@/lib/invoice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { ImagePicker } from "@/components/ui/image-picker";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusCard } from "@/components/ui/status-card";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceNotFound } from "./invoice-not-found";
import { InvoiceSummary } from "./invoice-summary";
import { LineItemsTable } from "./line-items-table";

type InvoiceErrors = Partial<Record<"number" | "billTo" | "form", string>>;

const currencyOptions = CURRENCIES.map((currency) => ({ value: currency, label: currency }));

type InvoiceFormProps = {
  invoices: Invoice[];
  initialInvoice: () => Invoice;
  saveLabel: string;
  saveInvoice: (invoice: Invoice) => boolean;
  onSaved: (invoice: Invoice) => void;
};

function InvoiceForm({
  invoices,
  initialInvoice,
  saveLabel,
  saveInvoice,
  onSaved,
}: InvoiceFormProps) {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [errors, setErrors] = useState<InvoiceErrors>({});
  const { download, pendingId, failed } = useInvoicePdfDownload();
  const totals = calculateTotals(invoice);

  function update<K extends keyof Invoice>(key: K, value: Invoice[K]) {
    setInvoice((current) => ({ ...current, [key]: value }));
  }

  function validate(number: string, billTo: string) {
    const nextErrors: InvoiceErrors = {};
    if (!number) nextErrors.number = "Nomor invoice wajib diisi.";
    else if (invoices.some((item) => item.id !== invoice.id && item.number === number)) {
      nextErrors.number = "Nomor invoice sudah dipakai.";
    }
    if (!billTo) nextErrors.billTo = "Bill To wajib diisi.";
    return nextErrors;
  }

  function validInvoice() {
    const current = {
      ...invoice,
      number: invoice.number.trim().toUpperCase(),
      billTo: invoice.billTo.trim(),
    };
    const nextErrors = validate(current.number, current.billTo);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length > 0 ? null : current;
  }

  function handleSave() {
    const saved = validInvoice();
    if (!saved) return;
    if (!saveInvoice(saved)) {
      setErrors({ form: "Invoice gagal disimpan. Periksa ruang penyimpanan browser." });
      return;
    }
    onSaved(saved);
  }

  function handleDownload() {
    const current = validInvoice();
    if (current) download(current);
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <Card className="flex flex-col gap-10 p-6 sm:p-10">
        <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
          <ImagePicker
            value={invoice.logo}
            onChange={(logo) => update("logo", logo)}
            alt="Logo perusahaan"
            pickLabel="Ganti Logo"
            resetValue={DEFAULT_LOGO}
          />
          <div className="flex flex-col gap-3 sm:items-end">
            <h2 className="text-4xl font-bold tracking-tight">INVOICE</h2>
            <Field
              label="Nomor invoice"
              htmlFor="invoice-number"
              error={errors.number}
              hideLabel
              className="sm:w-56"
            >
              <Input
                id="invoice-number"
                leading="#"
                align="right"
                invalid={Boolean(errors.number)}
                value={invoice.number}
                onChange={(event) => update("number", event.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Field label="From" htmlFor="company-name">
              <Input
                id="company-name"
                placeholder="Who is this from?"
                value={invoice.companyName}
                onChange={(event) => update("companyName", event.target.value)}
              />
            </Field>
            <Field label="Bill To" htmlFor="bill-to" error={errors.billTo}>
              <Input
                id="bill-to"
                placeholder="Who is this to?"
                invalid={Boolean(errors.billTo)}
                value={invoice.billTo}
                onChange={(event) => update("billTo", event.target.value)}
              />
            </Field>
          </div>
          <div className="flex flex-col gap-3 md:pt-7">
            <Field label="Date" htmlFor="invoice-date" inline>
              <Input
                id="invoice-date"
                type="date"
                value={invoice.date}
                onChange={(event) => update("date", event.target.value)}
              />
            </Field>
            <Field label="Due Date" htmlFor="due-date" inline>
              <Input
                id="due-date"
                type="date"
                min={invoice.date}
                value={invoice.dueDate}
                onChange={(event) => update("dueDate", event.target.value)}
              />
            </Field>
          </div>
        </div>

        <LineItemsTable
          items={invoice.items}
          currency={invoice.currency}
          onChange={(items) => update("items", items)}
        />

        <div className="grid gap-8 md:grid-cols-2">
          <Field label="Notes" htmlFor="notes">
            <Textarea
              id="notes"
              rows={5}
              placeholder={NOTES_PLACEHOLDER}
              value={invoice.notes}
              onChange={(event) => update("notes", event.target.value)}
            />
          </Field>
          <InvoiceSummary
            totals={totals}
            taxRate={invoice.taxRate}
            currency={invoice.currency}
            onTaxRateChange={(taxRate) => update("taxRate", taxRate)}
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Field label="Terms & Conditions" htmlFor="terms">
            <Textarea
              id="terms"
              rows={8}
              placeholder="Terms and conditions"
              value={invoice.terms}
              onChange={(event) => update("terms", event.target.value)}
            />
          </Field>
          <div className="flex flex-col gap-5">
            <Field label="Signature">
              <ImagePicker
                value={invoice.signature}
                onChange={(signature) => update("signature", signature)}
                alt="Tanda tangan"
                pickLabel="Upload Tanda Tangan"
                emptyText="Belum ada tanda tangan"
              />
            </Field>
            <Field label="Signatory Name" htmlFor="signatory">
              <Input
                id="signatory"
                placeholder="Who signs this invoice?"
                value={invoice.signatory}
                onChange={(event) => update("signatory", event.target.value)}
              />
            </Field>
          </div>
        </div>
      </Card>

      <aside className="order-first flex flex-col gap-3 lg:sticky lg:top-6 lg:order-none">
        <Button block onClick={handleSave}>
          <Save className="size-4" />
          {saveLabel}
        </Button>
        {errors.form && <p className="text-xs text-danger">{errors.form}</p>}
        <Button block variant="secondary" disabled={pendingId !== null} onClick={handleDownload}>
          {pendingId ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          Download PDF
        </Button>
        {failed && <p className="text-xs text-danger">PDF gagal dibuat. Coba lagi.</p>}
        <Field label="Currency" htmlFor="currency" className="mt-4 border-t border-border pt-6">
          <Select
            id="currency"
            options={currencyOptions}
            value={invoice.currency}
            onChange={(event) => update("currency", event.target.value as Currency)}
          />
        </Field>
      </aside>
    </div>
  );
}

export function InvoiceEditor({ defaults }: { defaults: InvoiceDefaults }) {
  const router = useRouter();
  const { invoices, saveInvoice } = useInvoices();
  const [formKey, setFormKey] = useState(0);

  if (!invoices) {
    return <StatusCard>Menyiapkan invoice...</StatusCard>;
  }

  return (
    <InvoiceForm
      key={formKey}
      invoices={invoices}
      initialInvoice={() => createInvoice(invoices, defaults)}
      saveLabel="Simpan Invoice"
      saveInvoice={saveInvoice}
      onSaved={() => {
        setFormKey((key) => key + 1);
        router.push("/");
      }}
    />
  );
}

export function EditInvoiceEditor({ id }: { id: string }) {
  const router = useRouter();
  const { invoices, saveInvoice } = useInvoices();

  if (!invoices) {
    return <StatusCard>Memuat invoice...</StatusCard>;
  }

  const invoice = invoices.find((item) => item.id === id);

  if (!invoice) {
    return <InvoiceNotFound />;
  }

  return (
    <InvoiceForm
      key={invoice.id}
      invoices={invoices}
      initialInvoice={() => invoice}
      saveLabel="Simpan Perubahan"
      saveInvoice={saveInvoice}
      onSaved={(saved) => router.push(`/invoices/${saved.id}`)}
    />
  );
}
