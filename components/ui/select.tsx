import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClass } from "./input";

type SelectProps = ComponentProps<"select"> & {
  options: ReadonlyArray<{ value: string; label: string }>;
};

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <div className={cn("relative h-control", controlClass(), className)}>
      <select
        className="h-full w-full cursor-pointer appearance-none bg-transparent pr-10 pl-3.5 outline-none"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
