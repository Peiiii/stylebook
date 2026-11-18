import type { ReactNode } from "react";
import { cn } from "../ui/cn";

export function ComponentPreview({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="preview"
      dir="ltr"
      className={cn(
        "flex w-full min-w-0 items-center justify-center",
        className,
      )}
      onSubmit={(event) => event.preventDefault()}
      onClick={(event) => {
        if (!(event.target instanceof Element)) return;
        const link = event.target.closest("a");
        if (link?.origin === location.origin) event.preventDefault();
      }}
    >
      {children}
    </div>
  );
}
