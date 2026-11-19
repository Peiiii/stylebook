import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { themes, type AtlasTheme } from "../themes";
import { Button } from "../ui/button";
import { cn } from "../ui/cn";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ThemeIcon, ThemePicker } from "./ThemePicker";

type ThemeSelection = {
  theme: AtlasTheme;
  onTheme: (theme: AtlasTheme["id"]) => void;
};

const directions = [
  {
    name: "A · 文字下划线",
    group: "gap-2",
    option:
      "relative rounded-none px-2 text-muted-foreground after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full data-[state=on]:bg-transparent data-[state=on]:text-primary data-[state=on]:after:bg-current",
  },
  {
    name: "B · 分段按钮",
    group: "gap-0.5 rounded-full bg-muted p-1",
    option:
      "h-8 rounded-full px-3 text-muted-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm",
  },
  {
    name: "C · 品牌图标",
    group: "gap-1",
    option:
      "size-10 rounded-xl p-0 aria-checked:bg-accent aria-checked:ring-1 aria-checked:ring-inset aria-checked:ring-primary/40 [&_img]:size-5 [&_svg]:size-5",
    icons: true,
  },
] as const;

function ComparisonRow({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-1.5 px-1 py-3 sm:px-3 lg:grid-cols-[9rem_minmax(0,1fr)_9rem] lg:items-center lg:gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="min-w-0 overflow-x-auto px-1 py-1">
        <div className="mx-auto w-max max-w-none">{children}</div>
      </div>
    </div>
  );
}

export function HomeThemeSwitcher({ theme, onTheme }: ThemeSelection) {
  const index = themes.findIndex(({ id }) => id === theme.id);

  function applyTheme(value: string) {
    const next = themes.find(({ id }) => id === value);
    if (next) onTheme(next.id);
  }

  function step(direction: -1 | 1) {
    const next = (index + direction + themes.length) % themes.length;
    onTheme(themes[next].id);
  }

  return (
    <section
      aria-labelledby="home-styles"
      className="mx-auto mb-9 max-w-5xl border-y py-3 sm:mb-12"
    >
      <h2
        id="home-styles"
        className="px-1 pt-2 pb-2 text-base font-semibold sm:px-3"
      >
        风格切换器对照
      </h2>
      <div className="divide-y">
        <TooltipProvider delayDuration={300}>
          {directions.map((direction) => (
            <ComparisonRow key={direction.name} title={direction.name}>
              <ToggleGroup
                type="single"
                value={theme.id}
                onValueChange={applyTheme}
                spacing={1}
                aria-label={direction.name}
                className={cn("w-max", direction.group)}
              >
                {themes.map(({ id, label }) => {
                  const icons = "icons" in direction;
                  const option = (
                    <ToggleGroupItem
                      key={id}
                      value={id}
                      aria-label={label}
                      className={cn("h-9 text-xs", direction.option)}
                    >
                      {icons ? <ThemeIcon id={id} /> : label}
                    </ToggleGroupItem>
                  );
                  return icons ? (
                    <Tooltip key={id}>
                      <TooltipTrigger asChild>{option}</TooltipTrigger>
                      <TooltipContent sideOffset={6}>{label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    option
                  );
                })}
              </ToggleGroup>
            </ComparisonRow>
          ))}
        </TooltipProvider>
        <ComparisonRow title="D · 紧凑下拉">
          <ThemePicker
            theme={theme}
            onTheme={applyTheme}
            label="下拉切换界面风格"
          />
        </ComparisonRow>
        <ComparisonRow title="E · 左右步进">
          <div
            aria-label="逐个切换界面风格"
            role="group"
            className="flex items-center gap-1 rounded-full border bg-card p-1 shadow-xs"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="上一个风格"
              onClick={() => step(-1)}
            >
              <ChevronLeft />
            </Button>
            <div className="flex min-w-30 items-center justify-between gap-2 px-1.5 text-xs">
              <span className="font-medium">{theme.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {index + 1} / {themes.length}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="下一个风格"
              onClick={() => step(1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </ComparisonRow>
      </div>
    </section>
  );
}
