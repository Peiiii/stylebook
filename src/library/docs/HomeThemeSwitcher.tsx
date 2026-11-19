import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { themes, type AtlasTheme } from "../themes";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { ThemeIcon } from "./ThemePicker";

export function HomeThemeSwitcher({
  theme,
  onTheme,
}: {
  theme: AtlasTheme;
  onTheme: (theme: AtlasTheme["id"]) => void;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ back: false, forward: false });

  useEffect(() => {
    const track = rail.current;
    if (!track) return;

    const updateEdges = () => {
      const back = track.scrollLeft > 1;
      const forward =
        track.scrollWidth - track.clientWidth - track.scrollLeft > 1;
      setEdges((current) =>
        current.back === back && current.forward === forward
          ? current
          : { back, forward },
      );
    };

    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    track.addEventListener("scroll", updateEdges, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", updateEdges);
    };
  }, []);

  function scrollRail(direction: -1 | 1) {
    const track = rail.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.75 });
  }

  return (
    <section
      aria-labelledby="home-styles"
      className="mx-auto mb-9 max-w-5xl rounded-2xl border bg-background shadow-sm sm:mb-12"
    >
      <div className="flex min-h-12 items-center justify-between gap-2 px-3 pt-1 sm:px-4">
        <h2 id="home-styles" className="text-sm font-semibold">
          选择你的界面风格
        </h2>
        <div hidden={!edges.back && !edges.forward} className="space-x-1">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="向左浏览风格"
            disabled={!edges.back}
            onClick={() => scrollRail(-1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="向右浏览风格"
            disabled={!edges.forward}
            onClick={() => scrollRail(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <ToggleGroup
        ref={rail}
        type="single"
        value={theme.id}
        onValueChange={(value) => {
          const next = themes.find((entry) => entry.id === value);
          if (next) onTheme(next.id);
        }}
        spacing={2}
        aria-labelledby="home-styles"
        className="no-scrollbar flex w-full snap-x snap-proximity items-stretch gap-2 overflow-x-auto scroll-px-3 px-3 pt-1 pb-3 motion-safe:scroll-smooth sm:scroll-px-4 sm:px-4 sm:pb-4"
      >
        {themes.map(({ id, label, description }) => (
          <ToggleGroupItem
            key={id}
            value={id}
            aria-label={label}
            title={description}
            className="group/option h-auto w-[7.25rem] snap-start flex-col items-stretch gap-1.5 rounded-xl border bg-background p-1.5 text-xs font-medium transition-colors hover:border-muted-foreground/35 hover:bg-muted/40 data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-foreground"
          >
            <span
              data-atlas-theme={id}
              aria-hidden="true"
              className="relative flex h-9 items-center justify-between gap-1.5 rounded-md border bg-card pr-6 pl-2"
            >
              <span className="text-base leading-none text-foreground [font-family:var(--atlas-heading)]">
                Aa
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-full border border-input bg-muted" />
                <span className="h-2.5 w-4 rounded-(--atlas-control-radius) bg-primary" />
              </span>
              <Check className="absolute top-1 right-1 size-3 text-primary opacity-0 group-data-[state=on]/option:opacity-100" />
            </span>
            <span className="flex min-w-0 items-center gap-1 px-0.5 pb-0.5">
              <ThemeIcon id={id} />
              <span className="flex-1 truncate text-left">{label}</span>
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </section>
  );
}
