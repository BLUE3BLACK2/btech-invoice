import type { ReactNode } from "react";
import { formatCurrency, parseAmount, type Currency, type InvoiceTotals } from "@/lib/invoice";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";

type SummaryRowProps = {
  label: string;
  emphasis?: "total" | "balance";
  children: ReactNode;
};

export function SummaryRow({ label, emphasis, children }: SummaryRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        emphasis && "border-t border-border pt-4",
        emphasis === "total" && "font-semibold",
        emphasis === "balance" && "text-lg font-bold",
      )}
    >
      <dt className={emphasis ? "text-ink" : "text-muted"}>{label}</dt>
      <dd className="tabular-nums">{children}</dd>
    </div>
  );
}

type InvoiceSummaryProps = {
  totals: InvoiceTotals;
  taxRate: number;
  currency: Currency;
  onTaxRateChange: (taxRate: number) => void;
};

export function InvoiceSummary({ totals, taxRate, currency, onTaxRateChange }: InvoiceSummaryProps) {
  return (
    <dl className="flex flex-col gap-4 text-sm">
      <SummaryRow label="Subtotal">{formatCurrency(totals.subtotal, currency)}</SummaryRow>
      <SummaryRow label="Tax">
        <Input
          aria-label="Tax (%)"
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          placeholder="0"
          trailing="%"
          align="right"
          className="w-32"
          value={taxRate || ""}
          onChange={(event) => onTaxRateChange(parseAmount(event.target.value))}
        />
      </SummaryRow>
      <SummaryRow label="Total" emphasis="total">
        {formatCurrency(totals.total, currency)}
      </SummaryRow>
      <SummaryRow label="Balance Due" emphasis="balance">
        {formatCurrency(totals.balanceDue, currency)}
      </SummaryRow>
    </dl>
  );
}
