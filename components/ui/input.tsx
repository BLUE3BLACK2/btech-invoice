import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function controlClass(invalid?: boolean) {
  return cn(
    "rounded-action border bg-surface text-sm text-ink transition-colors",
    "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/10",
    invalid ? "border-danger" : "border-border hover:border-subtle",
  );
}

type InputProps = ComponentProps<"input"> & {
  leading?: ReactNode;
  trailing?: ReactNode;
  invalid?: boolean;
  align?: "left" | "right";
};

export function Input({ leading, trailing, invalid, align = "left", className, ...props }: InputProps) {
  return (
    <div className={cn("flex h-control items-center gap-2 px-3.5", controlClass(invalid), className)}>
      {leading && <span className="shrink-0 text-subtle">{leading}</span>}
      <input
        aria-invalid={invalid || undefined}
        className={cn(
          "h-full w-full min-w-0 bg-transparent outline-none placeholder:text-subtle",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          align === "right" && "text-right",
        )}
        {...props}
      />
      {trailing && <span className="shrink-0 text-subtle">{trailing}</span>}
    </div>
  );
}
