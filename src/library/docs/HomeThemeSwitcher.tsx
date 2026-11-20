import { useEffect, useRef } from "react";
import { themes, type AtlasTheme } from "../themes";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "../ui/segmented-control";
import { ThemeIcon } from "./ThemePicker";

export function HomeThemeSwitcher({
  theme,
  onTheme,
}: {
  theme: AtlasTheme;
  onTheme: (theme: AtlasTheme["id"]) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Keep the chosen style in view when the row scrolls on narrow screens,
    // moving only the row so the page position stays put.
    const viewport = scroller.current;
    const selected = viewport?.querySelector<HTMLElement>(
      '[aria-checked="true"]',
    );
    if (!viewport || !selected) return;
    const frame = viewport.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.left < frame.left || item.right > frame.right)
      viewport.scrollLeft +=
        item.left - frame.left - (frame.width - item.width) / 2;
  }, [theme.id]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl md:col-span-2 md:row-start-2">
      <h2
        id="home-theme-label"
        className="mb-2 text-center text-base font-semibold"
      >
        选择界面风格
      </h2>
      <div ref={scroller} className="overflow-x-auto px-1 py-1">
        <SegmentedControl
          value={theme.id}
          onValueChange={(value) => {
            const next = themes.find(({ id }) => id === value);
            if (next) onTheme(next.id);
          }}
          aria-labelledby="home-theme-label"
          className="mx-auto w-max"
        >
          {themes.map(({ id, label }) => (
            <SegmentedControlItem
              key={id}
              value={id}
              className="h-11 min-w-11 px-3.5 sm:h-12 sm:px-4 xl:px-2.5 [&_img]:size-5 [&_svg]:size-5"
            >
              <ThemeIcon id={id} />
              <span className="leading-none">{label}</span>
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </div>
    </div>
  );
}
