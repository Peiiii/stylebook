import { useEffect, useRef } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export type DocGroup = {
  name: string;
  pages: { id: string; name: string; href: string; active: boolean }[];
};

// Adapted from apps/v4/components/docs-sidebar.tsx. The local registry supplies
// the page tree in place of the upstream site's MDX and feature flags.
export function DocsSidebar({ groups }: { groups: DocGroup[] }) {
  const content = useRef<HTMLDivElement>(null);
  const currentPage = groups
    .flatMap((group) => group.pages)
    .find((page) => page.active)?.id;
  useEffect(() => {
    const container = content.current;
    const active = container?.querySelector('[aria-current="page"]');
    if (!container || !active) return;
    const item = active.getBoundingClientRect();
    const viewport = container.getBoundingClientRect();
    if (item.top < viewport.top || item.bottom > viewport.bottom) {
      container.scrollTop += item.top - viewport.top - viewport.height / 2;
    }
  }, [currentPage]);
  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-var(--header-height)-0.6rem)] overflow-hidden overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex"
      collapsible="none"
    >
      <div className="absolute top-12 right-2 bottom-0 hidden w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)] lg:flex" />
      <SidebarContent
        ref={content}
        className="w-(--sidebar-menu-width) scroll-fade scrollbar-none overflow-x-hidden overscroll-contain pl-2.5"
      >
        {groups.map((item) => (
          <SidebarGroup key={item.name}>
            <SidebarGroupLabel className="font-medium text-muted-foreground">
              {item.name}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {item.pages.map((page) => (
                  <SidebarMenuItem key={page.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={page.active}
                      className="relative h-[30px] w-full overflow-visible border border-transparent text-[0.8rem] font-medium data-[active=true]:border-accent data-[active=true]:bg-accent"
                    >
                      <a
                        href={page.href}
                        aria-current={page.active ? "page" : undefined}
                      >
                        {page.name}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
