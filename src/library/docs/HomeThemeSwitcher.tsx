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
    <div className="mx-auto mb-9 max-w-5xl overflow-x-auto px-1 py-1 sm:mb-12">
      <ToggleGroup
        type="single"
        value={theme.id}
        onValueChange={(value) => {
          const next = themes.find(({ id }) => id === value);
          if (next) onTheme(next.id);
        }}
        spacing={1}
        aria-label="选择界面风格"
        className="mx-auto w-max gap-0.5 rounded-full bg-muted p-1"
      >
        {themes.map(({ id, label }) => (
          <ToggleGroupItem
            key={id}
            value={id}
            className="h-8 gap-1.5 rounded-full px-2.5 text-xs text-muted-foreground aria-checked:bg-background aria-checked:text-foreground aria-checked:shadow-sm"
          >
            <ThemeIcon id={id} />
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
