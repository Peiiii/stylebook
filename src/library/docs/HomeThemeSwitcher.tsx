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
    contents: "icon",
  },
] as const;

const moreDirections = [
  {
    name: "F · 品牌分段",
    group: "gap-0.5 rounded-full bg-muted p-1",
    option:
      "h-8 gap-1.5 rounded-full px-2.5 text-muted-foreground aria-checked:bg-background aria-checked:text-foreground aria-checked:shadow-sm",
    contents: "inline",
  },
  {
    name: "G · 图标与短标签",
    group: "gap-1",
    option:
      "h-12 min-w-16 flex-col gap-1 rounded-lg border-b-2 border-transparent px-1.5 text-[11px] text-muted-foreground aria-checked:border-primary aria-checked:bg-accent aria-checked:text-primary",
    contents: "inline",
  },
  {
    name: "H · 展开当前项",
    group: "gap-1 rounded-full border bg-muted/50 p-1",
    option:
      "h-8 min-w-8 gap-1.5 rounded-full px-2 text-foreground aria-checked:bg-background aria-checked:px-2.5 aria-checked:shadow-sm",
    contents: "current",
  },
  {
    name: "I · 独立描边",
    group: "gap-1.5",
    option:
      "h-9 gap-1.5 rounded-md border border-border bg-background px-2.5 aria-checked:border-primary aria-checked:bg-accent aria-checked:text-primary",
    contents: "inline",
  },
] as const;

const quickDirection = {
  name: "常用风格",
  group: "gap-1",
  option:
    "h-9 min-w-9 rounded-md px-2 aria-checked:bg-accent aria-checked:text-primary",
  contents: "icon",
} as const;
const quickThemes = themes.filter(
  ({ id }) => id === "ios" || id === "material" || id === "ant",
);

type Direction = {
  name: string;
  group: string;
  option: string;
  contents?: "icon" | "inline" | "current";
};

function ThemeOptions({
  direction,
  theme,
  onTheme,
  options = themes,
}: {
  direction: Direction;
  theme: AtlasTheme;
  onTheme: (id: string) => void;
  options?: readonly AtlasTheme[];
}) {
  const { contents } = direction;
  const showTooltip = contents === "icon" || contents === "current";

  return (
    <TooltipProvider delayDuration={300}>
      <ToggleGroup
        type="single"
        value={theme.id}
        onValueChange={onTheme}
        spacing={1}
        aria-label={direction.name}
        className={cn("w-max", direction.group)}
      >
        {options.map(({ id, label }) => {
          const option = (
            <ToggleGroupItem
              key={id}
              value={id}
              aria-label={label}
              className={cn("group/choice h-9 text-xs", direction.option)}
            >
              {contents && <ThemeIcon id={id} />}
              {contents !== "icon" && (
                <span
                  className={
                    contents === "current"
                      ? "hidden group-aria-checked/choice:inline"
                      : undefined
                  }
                >
                  {label}
                </span>
              )}
            </ToggleGroupItem>
          );
          return showTooltip ? (
            <Tooltip key={id}>
              <TooltipTrigger asChild>{option}</TooltipTrigger>
              <TooltipContent sideOffset={6}>{label}</TooltipContent>
            </Tooltip>
          ) : (
            option
          );
        })}
      </ToggleGroup>
    </TooltipProvider>
  );
}

function ComparisonRow({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-1.5 px-1 py-3 sm:px-3 lg:grid-cols-[8rem_minmax(0,1fr)_8rem] lg:items-center lg:gap-3">
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
      className="mx-auto mb-9 max-w-6xl border-y py-3 sm:mb-12"
    >
      <h2
        id="home-styles"
        className="px-1 pt-2 pb-2 text-base font-semibold sm:px-3"
      >
        风格切换器对照
      </h2>
      <div className="divide-y">
        {directions.map((direction) => (
          <ComparisonRow key={direction.name} title={direction.name}>
            <ThemeOptions
              direction={direction}
              theme={theme}
              onTheme={applyTheme}
            />
          </ComparisonRow>
        ))}
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
        {moreDirections.map((direction) => (
          <ComparisonRow key={direction.name} title={direction.name}>
            <ThemeOptions
              direction={direction}
              theme={theme}
              onTheme={applyTheme}
            />
          </ComparisonRow>
        ))}
        <ComparisonRow title="J · 常用加菜单">
          <div className="flex items-center gap-2 rounded-lg border bg-background p-1">
            <ThemeOptions
              direction={quickDirection}
              theme={theme}
              onTheme={applyTheme}
              options={quickThemes}
            />
            <div className="border-l pl-2">
              <ThemePicker
                theme={theme}
                onTheme={applyTheme}
                label="快捷栏全部风格"
                showCurrent={!quickThemes.some(({ id }) => id === theme.id)}
              />
            </div>
          </div>
        </ComparisonRow>
      </div>
    </section>
  );
}
