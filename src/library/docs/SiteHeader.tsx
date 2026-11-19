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
import { ThemePicker } from "./ThemePicker";
import type { AtlasTheme } from "../themes";

export function SiteHeader({
  items,
  activeView,
  groups,
  theme,
  themesHref,
  onTheme,
}: {
  items: React.ComponentProps<typeof MainNav>["items"];
  activeView: string;
  groups: DocGroup[];
  theme: AtlasTheme;
  themesHref: string;
  onTheme: (value: string) => void;
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="container-wrapper px-2 sm:px-6">
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
              <SheetTitle>Stylebook</SheetTitle>
              <SheetDescription className="sr-only">
                浏览组件总览、主题和页面模板。
              </SheetDescription>
              <SheetClose asChild>
                <a
                  href={items[0].href}
                  aria-current={activeView === "home" ? "page" : undefined}
                  className="rounded-md px-2 py-1 text-sm aria-[current=page]:bg-accent"
                >
                  首页
                </a>
              </SheetClose>
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
            className="mr-2 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold tracking-tight sm:mr-4"
            href={items[0].href}
          >
            <img
              src={`${import.meta.env.BASE_URL}stylebook-mark.svg`}
              alt=""
              width={20}
              height={20}
              className="size-5 shrink-0"
            />
            Stylebook
          </a>
          <MainNav
            items={items}
            active={activeView}
            className="hidden lg:flex"
            aria-label="主导航"
          />
          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:flex-1 md:justify-end">
            <CommandMenu groups={groups} />
            <ThemePicker
              theme={theme}
              onTheme={onTheme}
              themesHref={themesHref}
            />
            <Separator
              orientation="vertical"
              className="mx-1 hidden sm:block"
            />
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              className="hidden min-[360px]:inline-flex"
            >
              <a
                href="https://github.com/Peiiii/stylebook"
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
