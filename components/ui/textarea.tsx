import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClass } from "./input";

type TextareaProps = ComponentProps<"textarea"> & { invalid?: boolean };

export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        "block w-full resize-y px-3.5 py-3 leading-relaxed outline-none placeholder:text-subtle",
        controlClass(invalid),
        className,
      )}
      {...props}
    />
  );
}
