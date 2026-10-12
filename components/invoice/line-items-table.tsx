"use client";

import { Plus, X } from "lucide-react";
import {
  createLineItem,
  formatCurrency,
  lineItemAmount,
  parseAmount,
  type Currency,
  type LineItem,
} from "@/lib/invoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const rowGrid = "grid grid-cols-[minmax(0,1fr)_96px_176px_160px_36px] items-center gap-2";

type LineItemsTableProps = {
  items: LineItem[];
  currency: Currency;
  onChange: (items: LineItem[]) => void;
};

export function LineItemsTable({ items, currency, onChange }: LineItemsTableProps) {
  function updateItem(id: string, patch: Partial<LineItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto">
        <div className="flex min-w-[680px] flex-col gap-2">
          <div
            className={`${rowGrid} rounded-action bg-primary py-3 text-sm font-semibold text-white`}
          >
            <span className="px-3.5">Item</span>
            <span className="px-3.5">Quantity</span>
            <span className="px-3.5">Rate</span>
            <span className="px-3.5 text-right">Amount</span>
          </div>
          {items.map((item, index) => (
            <div key={item.id} className={rowGrid}>
              <Input
                aria-label={`Item ${index + 1}`}
                placeholder="Description of item/service..."
                value={item.description}
                onChange={(event) => updateItem(item.id, { description: event.target.value })}
              />
              <Input
                aria-label={`Quantity item ${index + 1}`}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="0"
                value={item.quantity || ""}
                onChange={(event) =>
                  updateItem(item.id, { quantity: parseAmount(event.target.value) })
                }
              />
              <Input
                aria-label={`Rate item ${index + 1}`}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="0"
                leading={currency}
                align="right"
                value={item.rate || ""}
                onChange={(event) => updateItem(item.id, { rate: parseAmount(event.target.value) })}
              />
              <span className="px-3.5 text-right text-sm font-medium tabular-nums">
                {formatCurrency(lineItemAmount(item), currency)}
              </span>
              <Button
                variant="danger"
                size="icon"
                aria-label={`Hapus item ${index + 1}`}
                disabled={items.length === 1}
                onClick={() => onChange(items.filter(({ id }) => id !== item.id))}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Button variant="soft" block onClick={() => onChange([...items, createLineItem()])}>
        <Plus className="size-4" />
        Tambah Item
      </Button>
    </div>
  );
}
