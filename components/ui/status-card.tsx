import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./card";

export function StatusCard({ className, ...props }: ComponentProps<"div">) {
  return <Card className={cn("p-10 text-center text-sm text-muted", className)} {...props} />;
}
