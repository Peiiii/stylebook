import { Suspense, useRef, type ReactNode } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import type { StylebookReference } from "../references";
import { ReferenceActions } from "./ReferenceActions";
import { ComponentPreview } from "./ComponentPreview";

export type ShowcaseEntry = {
  id: string;
  name: string;
  href: string;
  preview: ReactNode;
  reference: StylebookReference;
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

function CommandPreview({ children }: { children: ReactNode }) {
  // cmdk scrolls its first result into view on mount. Mount it after the
  // user opens the preview so it cannot move the showcase on entry.
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          打开命令面板
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-3 p-4">
        <DialogHeader className="pr-7">
          <DialogTitle>Command</DialogTitle>
          <DialogDescription className="sr-only">
            搜索并选择一条命令。
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

type ShowcaseGroup = { id: string; name: string; entries: ShowcaseEntry[] };

function GroupSequence({
  groups,
  onSectionReady,
}: {
  groups: ShowcaseGroup[];
  onSectionReady: (section: HTMLElement | null) => void;
}) {
  const [group, ...rest] = groups;
  if (!group) return null;
  // One boundary per group that also wraps the groups after it: a group
  // appears whole and never before the groups above it, so slower demos such
  // as Calendar cannot push cards that are already on screen.
  return (
    <Suspense
      fallback={
        <div role="status" className="min-h-svh">
          <span className="sr-only">正在加载预览</span>
        </div>
      }
    >
      <ShowcaseSection group={group} onSectionReady={onSectionReady} />
      <GroupSequence groups={rest} onSectionReady={onSectionReady} />
    </Suspense>
  );
}

function ShowcaseSection({
  group,
  onSectionReady,
}: {
  group: ShowcaseGroup;
  onSectionReady: (section: HTMLElement | null) => void;
}) {
  return (
    <section
      ref={onSectionReady}
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
              isWide ? "showcase-grid showcase-grid-wide" : "showcase-grid"
            }
          >
            {entries.map((entry) => (
              <article
                key={entry.id}
                data-showcase-component={entry.id}
                className="showcase-card reference-surface"
              >
                <div className="relative pr-9">
                  <h3 className="px-3 pt-2 text-xs font-medium">
                    <a
                      href={entry.href}
                      className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {entry.name}
                    </a>
                  </h3>
                  <ReferenceActions
                    reference={entry.reference}
                    className="reference-reveal absolute top-0 right-1"
                  />
                </div>
                <ComponentPreview className="flex-1 px-3 pt-2 pb-3">
                  {entry.id === "command" ? (
                    <CommandPreview>{entry.preview}</CommandPreview>
                  ) : (
                    entry.preview
                  )}
                </ComponentPreview>
              </article>
            ))}
          </div>
        );
      })}
    </section>
  );
}

export function Showcase({
  theme,
  themeCitation,
  groups,
}: {
  theme: string;
  themeCitation: StylebookReference;
  groups: ShowcaseGroup[];
}) {
  const pendingGroup = useRef<string | null>(null);
  function revealSection(section: HTMLElement) {
    pendingGroup.current = null;
    section.focus({ preventScroll: true });
    section.scrollIntoView();
  }

  return (
    <TooltipProvider>
      <main
        data-slot="component-showcase"
        className="container-wrapper px-4 pt-6 pb-12 md:px-8"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">组件总览</h1>
          <div className="flex items-center gap-1">
            <p className="text-sm text-muted-foreground">
              {theme} ·{" "}
              {groups.reduce((total, group) => total + group.entries.length, 0)}{" "}
              个组件
            </p>
            <ReferenceActions reference={themeCitation} />
          </div>
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
                if (section) revealSection(section);
                else pendingGroup.current = group.id;
              }}
            >
              {group.name}
            </button>
          ))}
        </nav>
        <GroupSequence
          groups={groups}
          onSectionReady={(section) => {
            if (section && section.id === pendingGroup.current) {
              revealSection(section);
            }
          }}
        />
      </main>
    </TooltipProvider>
  );
}
