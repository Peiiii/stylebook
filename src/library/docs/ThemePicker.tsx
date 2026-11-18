import { ChevronDown } from "lucide-react";
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

export function ThemeSwatch({ id }: { id: string }) {
  return (
    <span
      data-atlas-theme={id}
      className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-border bg-background"
      aria-hidden="true"
    >
      <span className="size-2 rounded-xs bg-primary" />
    </span>
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
          <ThemeSwatch id={theme.id} />
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
              <ThemeSwatch id={entry.id} />
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
