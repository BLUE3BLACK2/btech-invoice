import type { ReactNode } from "react";

type PageHeadingProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeading({ title, description, actions }: PageHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="text-muted">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
