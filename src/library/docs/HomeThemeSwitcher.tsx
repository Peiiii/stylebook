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
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl md:col-span-2 md:row-start-2">
      <h2
        id="home-theme-label"
        className="mb-2 text-center text-base font-semibold"
      >
        选择界面风格
      </h2>
      <div className="overflow-x-auto px-1 py-1">
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
              className="h-11 min-w-11 px-3.5 sm:h-12 sm:px-4 [&_img]:size-5 [&_svg]:size-5"
            >
              <ThemeIcon id={id} />
              {label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </div>
    </div>
  );
}
