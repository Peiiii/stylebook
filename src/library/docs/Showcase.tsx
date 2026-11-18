import type { ReactNode } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { ComponentPreview } from "./ComponentPreview";

export type ShowcaseEntry = {
  id: string;
  name: string;
  href: string;
  preview: ReactNode;
};

const wide = new Set([
  "accordion",
  "alert",
  "breadcrumb",
  "calendar",
  "card",
  "checkbox",
  "command",
  "empty",
  "field",
  "input-group",
  "navigation-menu",
  "pagination",
  "scroll-area",
  "table",
  "tabs",
]);

export function Showcase({
  theme,
  groups,
}: {
  theme: string;
  groups: { id: string; name: string; entries: ShowcaseEntry[] }[];
}) {
  return (
    <TooltipProvider>
      <main className="container-wrapper px-4 pt-6 pb-12 md:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">组件总览</h1>
          <p className="text-sm text-muted-foreground">
            {theme} ·{" "}
            {groups.reduce((total, group) => total + group.entries.length, 0)}{" "}
            个组件
          </p>
        </div>
        <nav
          aria-label="组件分组"
          className="mt-3 flex flex-wrap gap-1.5 border-b pb-3"
        >
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              className="rounded-md border px-2.5 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => {
                const section = document.getElementById(group.id);
                section?.focus({ preventScroll: true });
                section?.scrollIntoView();
              }}
            >
              {group.name}
            </button>
          ))}
        </nav>
        {groups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            tabIndex={-1}
            aria-labelledby={group.id + "-title"}
            className="mt-5 scroll-mt-18"
          >
            <h2 id={group.id + "-title"} className="mb-2 text-sm font-semibold">
              {group.name}
            </h2>
            {[false, true].map((isWide) => {
              const entries = group.entries.filter(
                (entry) => wide.has(entry.id) === isWide,
              );
              if (!entries.length) return null;
              return (
                <div
                  key={String(isWide)}
                  className={
                    isWide
                      ? "showcase-grid showcase-grid-wide"
                      : "showcase-grid"
                  }
                >
                  {entries.map((entry) => (
                    <article
                      key={entry.id}
                      data-showcase-component={entry.id}
                      className="showcase-card"
                    >
                      <h3 className="px-3 pt-2 text-xs font-medium">
                        <a
                          href={entry.href}
                          className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {entry.name}
                        </a>
                      </h3>
                      <ComponentPreview className="flex-1 px-3 pt-2 pb-3">
                        {entry.preview}
                      </ComponentPreview>
                    </article>
                  ))}
                </div>
              );
            })}
          </section>
        ))}
      </main>
    </TooltipProvider>
  );
}
