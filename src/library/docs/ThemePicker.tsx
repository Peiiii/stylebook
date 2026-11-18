import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { themeGroups, type AtlasTheme } from "../themes";

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
        className="z-60 w-64 max-w-[calc(100vw-1rem)] max-h-[min(38rem,var(--radix-dropdown-menu-content-available-height))] overscroll-contain p-1.5"
      >
        {themeGroups.map((group) => (
          <DropdownMenuRadioGroup
            key={group.label}
            value={theme.id}
            onValueChange={onTheme}
            aria-label={group.label}
          >
            <DropdownMenuLabel className="px-2 py-1 text-xs font-medium text-muted-foreground">
              {group.label}
            </DropdownMenuLabel>
            <div className="grid grid-cols-2 gap-px">
              {group.themes.map((entry) => (
                <DropdownMenuRadioItem
                  key={entry.id}
                  value={entry.id}
                  textValue={entry.label + " " + entry.search}
                  className="min-h-8 gap-1.5 py-1 pl-6 pr-1 text-xs data-[state=checked]:bg-accent [&>span:first-child]:left-1.5"
                >
                  <ThemeSwatch id={entry.id} />
                  <span className="truncate">{entry.label}</span>
                </DropdownMenuRadioItem>
              ))}
            </div>
          </DropdownMenuRadioGroup>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <a href={themesHref}>浏览全部主题</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
