import { Menu } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import type { DocGroup } from "./DocsSidebar";
import { MainNav } from "./MainNav";
import { CommandMenu } from "./CommandMenu";

export function SiteHeader({
  items,
  groups,
  themes,
  theme,
  onTheme,
}: {
  items: React.ComponentProps<typeof MainNav>["items"];
  groups: DocGroup[];
  themes: { id: string; label: string }[];
  theme: string;
  onTheme: (value: string) => void;
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="container-wrapper px-6">
        <div className="flex h-(--header-height) items-center **:data-[slot=separator]:h-4!">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 lg:hidden"
                aria-label="打开导航"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto px-4 py-6">
              <SheetTitle>UI Atlas</SheetTitle>
              <SheetDescription className="sr-only">
                浏览组件、主题和页面模板。
              </SheetDescription>
              {groups.map((group) => (
                <div key={group.name} className="grid gap-1">
                  <h2 className="px-2 text-xs font-semibold text-muted-foreground">
                    {group.name}
                  </h2>
                  {group.pages.map((page) => (
                    <SheetClose key={page.id} asChild>
                      <a
                        href={page.href}
                        aria-current={page.active ? "page" : undefined}
                        className="rounded-md px-2 py-1 text-sm aria-[current=page]:bg-accent"
                      >
                        {page.name}
                      </a>
                    </SheetClose>
                  ))}
                </div>
              ))}
            </SheetContent>
          </Sheet>
          <a
            className="mr-4 shrink-0 text-sm font-semibold tracking-tight"
            href={items[0].href}
          >
            UI Atlas
          </a>
          <MainNav
            items={items}
            className="hidden lg:flex"
            aria-label="主导航"
          />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <CommandMenu groups={groups} />
            <label className="sr-only" htmlFor="atlas-theme">
              主题
            </label>
            <select
              id="atlas-theme"
              value={theme}
              onChange={(e) => onTheme(e.target.value)}
              className="max-w-36 rounded-md border bg-background px-2 py-1 text-sm"
            >
              {themes.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
            <Separator orientation="vertical" className="mx-1" />
            <Button asChild variant="ghost" size="icon-sm">
              <a
                href="https://github.com/Peiiii/ui-atlas"
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <IconBrandGithub />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
