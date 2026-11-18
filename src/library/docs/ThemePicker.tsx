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
      className="inline-flex size-4 shrink-0 items-end justify-end rounded-sm border border-border bg-background p-px"
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
        className="z-60 w-72 max-w-[calc(100vw-1rem)] max-h-[min(38rem,var(--radix-dropdown-menu-content-available-height))] overscroll-contain p-1.5"
      >
        <DropdownMenuRadioGroup value={theme.id} onValueChange={onTheme}>
          {themes.map((entry) => (
            <DropdownMenuRadioItem
              key={entry.id}
              value={entry.id}
              textValue={entry.label}
              className="min-h-11 cursor-pointer gap-2 py-2 pl-7 pr-2 data-[state=checked]:bg-accent"
            >
              <ThemeSwatch id={entry.id} />
              <span className="min-w-0">
                <span className="block font-medium">{entry.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {entry.description}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <a href={themesHref}>浏览全部主题</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
