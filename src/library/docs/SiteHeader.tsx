import { Menu } from "lucide-react";
import { repositoryUrl } from "../references";
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

const drawerLink =
  "flex h-10 items-center rounded-md px-3 text-sm text-foreground outline-none hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-accent aria-[current=page]:font-semibold aria-[current=page]:text-accent-foreground aria-[current=true]:font-semibold aria-[current=true]:text-primary";

export function SiteHeader({
  items,
  activeView,
  groups,
  searchGroups,
  theme,
  themesHref,
  onTheme,
}: {
  items: React.ComponentProps<typeof MainNav>["items"];
  activeView: string;
  groups: DocGroup[];
  searchGroups: DocGroup[];
  theme: AtlasTheme;
  themesHref: string;
  onTheme: (value: string) => void;
}) {
  // The drawer lists the main entries first; directory pages that repeat a
  // main entry (theme presets, overviews) are left out below them.
  const mainIds = new Set(items.map((item) => item.id));
  const directory = groups
    .map((group) => ({
      ...group,
      pages: group.pages.filter((page) => !mainIds.has(page.id)),
    }))
    .filter((group) => group.pages.length > 0);
  // When a directory page is open, its main entry is marked as the current
  // section rather than as a second current page.
  const openPage = directory.some((group) =>
    group.pages.some((page) => page.active),
  );
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
            <SheetContent
              side="left"
              className="gap-5 overflow-y-auto px-3 py-6"
            >
              <SheetTitle className="px-3">Stylebook</SheetTitle>
              <SheetDescription className="sr-only">
                浏览首页、组件总览、场景、页面模板、组件、主题和接入教程。
              </SheetDescription>
              <nav aria-label="主导航" className="grid gap-0.5">
                {items.map((item) => (
                  <SheetClose key={item.id} asChild>
                    <a
                      href={item.href}
                      aria-current={
                        activeView === item.id
                          ? openPage
                            ? "true"
                            : "page"
                          : undefined
                      }
                      className={drawerLink}
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <Separator />
              <nav aria-label="组件目录" className="grid gap-4">
                {directory.map((group) => (
                  <div key={group.name} className="grid gap-0.5">
                    <h2 className="px-3 pb-1 text-xs font-semibold text-muted-foreground">
                      {group.name}
                    </h2>
                    {group.pages.map((page) => (
                      <SheetClose key={page.id} asChild>
                        <a
                          href={page.href}
                          aria-current={page.active ? "page" : undefined}
                          className={drawerLink}
                        >
                          {page.name}
                        </a>
                      </SheetClose>
                    ))}
                  </div>
                ))}
              </nav>
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
            <CommandMenu
              groups={searchGroups}
              theme={theme}
              onTheme={onTheme}
            />
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
              className="hidden min-[360px]:inline-flex sm:size-9"
            >
              <a
                href={repositoryUrl}
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <IconBrandGithub className="size-5" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
