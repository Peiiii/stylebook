import {
  BookOpen,
  ChevronDown,
  Cloud,
  Newspaper,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { themes, type AtlasTheme } from "../themes";

// Original styles use a Lucide symbol that inherits the surrounding text color.
const themeSymbols = {
  retro: BookOpen,
  editorial: Newspaper,
  aurora: Sparkles,
  clay: Cloud,
  pop: Zap,
} satisfies Partial<Record<AtlasTheme["id"], LucideIcon>>;

const themeLogos = {
  shadcn: "shadcn",
  material: "material",
  ios: "apple",
  fluent: "windows",
  ant: "ant",
  chatgpt: "chatgpt",
  claude: "claude",
} satisfies Record<
  Exclude<AtlasTheme["id"], keyof typeof themeSymbols>,
  string
>;

// Single-color brand marks that dark themes render light.
const monochromeLogos = new Set<AtlasTheme["id"]>(["ios", "shadcn", "chatgpt"]);

export function ThemeIcon({ id }: { id: AtlasTheme["id"] }) {
  if (id in themeSymbols) {
    const Mark = themeSymbols[id as keyof typeof themeSymbols];
    return <Mark className="size-4 shrink-0" aria-hidden="true" />;
  }

  return (
    <img
      src={`${import.meta.env.BASE_URL}theme-icons/${themeLogos[id as keyof typeof themeLogos]}.svg`}
      alt=""
      width={16}
      height={16}
      data-monochrome-logo={monochromeLogos.has(id) || undefined}
      className="size-4 shrink-0 object-contain [color-scheme:light]"
    />
  );
}

export function ThemePicker({
  theme,
  onTheme,
  themesHref,
}: {
  theme: AtlasTheme;
  onTheme: (value: string) => void;
  themesHref: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="切换主题"
          className="max-w-28 shrink-0 gap-1.5 px-2 min-[360px]:max-w-32 sm:max-w-44 sm:px-2.5 data-[state=open]:bg-accent"
        >
          <ThemeIcon id={theme.id} />
          <span className="truncate">{theme.label}</span>
          <ChevronDown className="size-3.5 opacity-65" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        collisionPadding={8}
        className="z-60 w-52 max-w-[calc(100vw-1rem)] overscroll-contain p-1"
      >
        <DropdownMenuRadioGroup value={theme.id} onValueChange={onTheme}>
          {themes.map((entry) => (
            <DropdownMenuRadioItem
              key={entry.id}
              value={entry.id}
              textValue={entry.label}
              indicator="check-end"
              className="h-10 cursor-pointer whitespace-nowrap"
            >
              <ThemeIcon id={entry.id} />
              <span className="min-w-0 truncate">{entry.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="h-10 cursor-pointer pl-8">
          <a href={themesHref}>浏览全部主题</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
