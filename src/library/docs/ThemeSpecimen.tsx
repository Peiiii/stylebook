import type { StylebookReference } from "../references";
import type { AtlasTheme } from "../themes";
import { LayoutSheet } from "./HomeStyleArtwork";
import { ReferenceActions } from "./ReferenceActions";
import { ThemeIcon } from "./ThemePicker";

// One card on the themes page: the homepage page thumbnail rendered in the
// card's own theme, so the eight styles can be compared side by side.
export function ThemeSpecimen({
  theme,
  current,
  reference,
  showcaseHref,
  sceneHref,
}: {
  theme: AtlasTheme;
  current: boolean;
  reference: StylebookReference;
  showcaseHref: string;
  sceneHref: string;
}) {
  const titleId = `theme-specimen-${theme.id}`;
  return (
    <section
      data-atlas-theme={theme.id}
      data-theme-specimen={theme.id}
      aria-labelledby={titleId}
      className="style-specimen reference-surface flex min-w-0 flex-col gap-3 border bg-background p-4 text-foreground"
    >
      <div className="flex items-center justify-between gap-2">
        <h2
          id={titleId}
          className="flex min-w-0 items-center gap-2 text-base font-semibold"
        >
          <ThemeIcon id={theme.id} />
          <span className="truncate">{theme.label}</span>
          {current && (
            <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              当前
            </span>
          )}
        </h2>
        <ReferenceActions
          reference={reference}
          showSource
          className="reference-reveal"
        />
      </div>
      <div
        aria-hidden="true"
        className="rounded-(--atlas-surface-radius) bg-muted/60 p-[6%]"
      >
        <LayoutSheet theme={theme.id} className="relative w-full shadow-sm" />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {theme.description}
      </p>
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
        <a
          href={showcaseHref}
          className="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          组件总览<span className="sr-only">（{theme.label}）</span>
        </a>
        <a
          href={sceneHref}
          className="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          场景总览<span className="sr-only">（{theme.label}）</span>
        </a>
      </div>
    </section>
  );
}
