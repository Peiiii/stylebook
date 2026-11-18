import type { ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../ui/button";

type PageLink = { href: string; name: string };

// Retained reading column, pager and contents rail from
// apps/v4/app/(app)/docs/[[...slug]]/page.tsx.
export function DocPage({
  title,
  description,
  previous,
  next,
  sections,
  children,
}: {
  title: string;
  description?: string;
  previous?: PageLink;
  next?: PageLink;
  sections: { id: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <main className="flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-160 min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-foreground md:px-0 lg:py-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 md:items-start">
              <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl">
                {title}
              </h1>
              <div className="docs-nav flex shrink-0 items-center gap-2">
                {previous && (
                  <Button
                    asChild
                    variant="outline"
                    size="icon-sm"
                    className="size-8 shadow-none md:size-7"
                  >
                    <a
                      href={previous.href}
                      aria-label={`Previous: ${previous.name}`}
                    >
                      <ChevronLeftIcon />
                    </a>
                  </Button>
                )}
                {next && (
                  <Button
                    asChild
                    variant="outline"
                    size="icon-sm"
                    className="size-8 shadow-none md:size-7"
                  >
                    <a href={next.href} aria-label={`Next: ${next.name}`}>
                      <ChevronRightIcon />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            {description && (
              <p className="text-[1.05rem] text-muted-foreground sm:text-base sm:text-balance md:max-w-[80%]">
                {description}
              </p>
            )}
          </div>
          <div className="typeset w-full flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0">
            {children}
          </div>
        </div>
      </div>
      <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[90svh] w-48 shrink-0 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
        <div className="h-(--top-spacing) shrink-0" />
        {sections.length > 0 && (
          <div className="flex scroll-fade scrollbar-none flex-col gap-3 overflow-y-auto px-6 pt-8 text-sm">
            <span className="font-medium">On This Page</span>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(section.id)
                    ?.scrollIntoView({ block: "start", behavior: "smooth" });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                {section.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
