import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "soft" | "ghost" | "danger";
type ButtonSize = "md" | "sm" | "icon";

type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "border border-border bg-surface text-ink hover:border-primary hover:text-primary",
  soft: "bg-primary-soft text-primary hover:bg-primary/10",
  ghost: "text-primary hover:bg-primary-soft",
  danger: "text-subtle hover:bg-danger-soft hover:text-danger",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-control px-5 text-sm",
  sm: "h-9 px-3 text-sm",
  icon: "size-9 shrink-0",
};

export function buttonClass({ variant = "primary", size = "md", block }: ButtonStyleProps) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-action font-medium transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    block && "w-full",
  );
}

type ButtonProps = ComponentProps<"button"> & ButtonStyleProps;

export function Button({ variant, size, block, className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClass({ variant, size, block }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps;

export function ButtonLink({ variant, size, block, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonClass({ variant, size, block }), className)} {...props} />;
}
