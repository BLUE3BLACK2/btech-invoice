"use client";

import { Download, LoaderCircle, Save } from "lucide-react";
import { unstable_rethrow } from "next/navigation";
import { useState, useTransition } from "react";
import { saveInvoiceAction } from "@/app/(app)/invoices/actions";
import { useInvoicePdfDownload } from "@/hooks/use-invoice-pdf";
import { useIsClient } from "@/hooks/use-is-client";
import {
  CURRENCIES,
  calculateTotals,
  createInvoice,
  DEFAULT_LOGO,
  NOTES_PLACEHOLDER,
  validateInvoice,
  type Client,
  type Currency,
  type Invoice,
  type InvoiceDefaults,
  type InvoiceErrors,
} from "@/lib/invoice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { ImagePicker } from "@/components/ui/image-picker";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusCard } from "@/components/ui/status-card";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceSummary } from "./invoice-summary";
import { LineItemsTable } from "./line-items-table";

const currencyOptions = CURRENCIES.map((currency) => ({ value: currency, label: currency }));

type InvoiceFormProps = {
  initialInvoice: () => Invoice;
  clients: Client[];
  saveLabel: string;
};

function InvoiceForm({ initialInvoice, clients, saveLabel }: InvoiceFormProps) {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [errors, setErrors] = useState<InvoiceErrors>({});
  const [saving, startSaving] = useTransition();
  const { download, pendingId, failed } = useInvoicePdfDownload();
  const totals = calculateTotals(invoice);

  function update<K extends keyof Invoice>(key: K, value: Invoice[K]) {
    setInvoice((current) => ({ ...current, [key]: value }));
  }

  function updateBillTo(billTo: string) {
    const client = clients.find(
      (item) => item.name.toLowerCase() === billTo.trim().toLowerCase(),
    );
    setInvoice((current) => ({
      ...current,
      billTo,
      billToDetails: client?.details || current.billToDetails,
    }));
  }

  function validInvoice() {
    const current = {
      ...invoice,
      number: invoice.number.trim().toUpperCase(),
      billTo: invoice.billTo.trim(),
    };
    const nextErrors = validateInvoice(current);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length > 0 ? null : current;
  }

  function handleSave() {
    const saved = validInvoice();
    if (!saved) return;
    startSaving(async () => {
      try {
        setErrors(await saveInvoiceAction(saved));
      } catch (error) {
        unstable_rethrow(error);
        setErrors({ form: "Invoice gagal disimpan. Periksa koneksi lalu coba lagi." });
      }
    });
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
                list="client-options"
                autoComplete="off"
                placeholder="Who is this to?"
                invalid={Boolean(errors.billTo)}
                value={invoice.billTo}
                onChange={(event) => updateBillTo(event.target.value)}
              />
              <datalist id="client-options">
                {clients.map((client) => (
                  <option key={client.name} value={client.name} />
                ))}
              </datalist>
            </Field>
            <Field label="Bill To Details" htmlFor="bill-to-details">
              <Textarea
                id="bill-to-details"
                rows={3}
                placeholder="Alamat, email, atau nomor telepon klien"
                value={invoice.billToDetails}
                onChange={(event) => update("billToDetails", event.target.value)}
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
        <Button block disabled={saving} onClick={handleSave}>
          {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
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

export function InvoiceEditor({
  defaults,
  clients,
}: {
  defaults: InvoiceDefaults;
  clients: Client[];
}) {
  const isClient = useIsClient();

  if (!isClient) {
    return <StatusCard>Menyiapkan invoice...</StatusCard>;
  }

  return (
    <InvoiceForm
      initialInvoice={() => createInvoice(defaults)}
      clients={clients}
      saveLabel="Simpan Invoice"
    />
  );
}

export function EditInvoiceEditor({ invoice, clients }: { invoice: Invoice; clients: Client[] }) {
  return (
    <InvoiceForm
      key={invoice.id}
      initialInvoice={() => invoice}
      clients={clients}
      saveLabel="Simpan Perubahan"
    />
  );
}
