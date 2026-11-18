import { BookOpen, ChevronDown } from "lucide-react";
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

const themeLogos = {
  shadcn: "shadcn",
  material: "material",
  ios: "apple",
  ant: "ant",
  chatgpt: "chatgpt",
  claude: "claude",
} satisfies Record<Exclude<AtlasTheme["id"], "retro">, string>;

function ThemeIcon({ id }: { id: AtlasTheme["id"] }) {
  if (id === "retro") {
    return (
      <BookOpen
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={`${import.meta.env.BASE_URL}theme-icons/${themeLogos[id]}.svg`}
      alt=""
      width={16}
      height={16}
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
          className="max-w-32 shrink-0 gap-1.5 px-2 sm:max-w-44 sm:px-2.5 data-[state=open]:bg-accent"
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
