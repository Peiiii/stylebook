import { themes, type AtlasTheme } from "../themes";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
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
        <ToggleGroup
          type="single"
          value={theme.id}
          onValueChange={(value) => {
            const next = themes.find(({ id }) => id === value);
            if (next) onTheme(next.id);
          }}
          spacing={1}
          aria-labelledby="home-theme-label"
          className="mx-auto w-max gap-1 rounded-full border bg-muted p-1.5"
        >
          {themes.map(({ id, label }) => (
            <ToggleGroupItem
              key={id}
              value={id}
              className="h-11 min-w-11 gap-2 rounded-full border border-transparent px-3.5 text-sm text-foreground aria-checked:border-primary/35 aria-checked:bg-background aria-checked:text-primary aria-checked:shadow-sm sm:h-12 sm:px-4 [&_img]:size-5 [&_svg]:size-5"
            >
              <ThemeIcon id={id} />
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
