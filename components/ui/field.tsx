import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  inline?: boolean;
  className?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, error, inline, className, children }: FieldProps) {
  return (
    <div
      className={cn(
        inline ? "grid grid-cols-[minmax(96px,1fr)_minmax(0,1.6fr)] items-center gap-3" : "flex flex-col gap-2",
        className,
      )}
    >
      <label htmlFor={htmlFor} className="text-sm font-medium text-muted">
        {label}
      </label>
      {children}
      {error && (
        <p className={cn("text-xs text-danger", inline && "col-start-2")}>{error}</p>
      )}
    </div>
  );
}
