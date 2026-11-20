import { useEffect, useState } from "react";
import { CheckIcon, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { themes, type AtlasTheme } from "../themes";
import type { DocGroup } from "./DocsSidebar";
import { ThemeIcon } from "./ThemePicker";

// Trimmed from apps/v4/components/command-menu.tsx. Local registry items
// replace site search, analytics, color lookups and package-manager commands.
export function CommandMenu({
  groups,
  theme,
  onTheme,
}: {
  groups: DocGroup[];
  theme: AtlasTheme;
  onTheme: (value: AtlasTheme["id"]) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/"))
        return;
      if (
        (e.target instanceof HTMLElement && e.target.isContentEditable) ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;
      e.preventDefault();
      setOpen((value) => !value);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative h-8 shrink-0 justify-start rounded-lg border-none bg-muted px-2 text-foreground shadow-none transition-colors hover:bg-muted/50 md:w-48 md:px-3 lg:w-40 xl:w-64"
          aria-label="搜索文档"
        >
          <SearchIcon className="md:hidden" />
          <span className="hidden xl:inline-flex">搜索组件、风格或案例…</span>
          <span className="hidden md:inline-flex xl:hidden">搜索…</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        data-docs-search=""
        showCloseButton={false}
        className="rounded-xl bg-clip-padding p-2 shadow-2xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>搜索文档</DialogTitle>
          <DialogDescription>
            查找组件、风格、应用案例和页面模板。
          </DialogDescription>
        </DialogHeader>
        <Command className="rounded-none bg-transparent **:data-[slot=command-input]:h-9! **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-9! **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border **:data-[slot=command-input-wrapper]:border-input **:data-[slot=command-input-wrapper]:bg-card">
          <CommandInput placeholder="搜索组件、风格或案例…" />
          <CommandList className="no-scrollbar min-h-60 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="py-12 text-center text-sm text-muted-foreground">
              没有找到匹配的结果，试试组件英文名、风格名或“案例”。
            </CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.name} heading={group.name}>
                {group.pages.map((page) => (
                  <CommandItem
                    key={page.id}
                    value={page.name}
                    keywords={[page.id, group.name, ...(page.keywords ?? [])]}
                    className="h-9 rounded-md px-3! font-medium"
                    onSelect={() => {
                      setOpen(false);
                      window.location.hash = page.href;
                    }}
                  >
                    {page.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandGroup heading="风格">
              {themes.map((entry) => (
                <CommandItem
                  key={entry.id}
                  value={entry.label}
                  keywords={[entry.id, entry.description, "风格", "主题"]}
                  className="h-9 rounded-md px-3! font-medium"
                  onSelect={() => {
                    setOpen(false);
                    onTheme(entry.id);
                  }}
                >
                  <ThemeIcon id={entry.id} />
                  {entry.label}
                  {entry.id === theme.id && (
                    <>
                      <CheckIcon aria-hidden="true" className="ml-auto" />
                      <span className="sr-only">（当前风格）</span>
                    </>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <p className="px-3 pt-2 pb-1 text-xs text-muted-foreground">
            ↑↓ 选择 · 回车打开 · 选择风格会直接应用到当前页面
          </p>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
