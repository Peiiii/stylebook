"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../../../ui/sidebar";

type NavSubItem = {
  title: string;
  isActive?: boolean;
} & ({ url: string } | { onSelect: () => void });

export function NavMain({
  items,
  label = "平台",
}: {
  label?: string;
  items: {
    title: string;
    icon?: LucideIcon;
    isActive?: boolean;
    url?: string;
    items?: NavSubItem[];
  }[];
}) {
  const { state, isMobile, setOpen } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  aria-label={item.title}
                  onClick={(event) => {
                    if (isMobile || state !== "collapsed") return;
                    setOpen(true);
                    if (
                      event.currentTarget.getAttribute("aria-expanded") ===
                      "true"
                    ) {
                      event.preventDefault();
                    }
                  }}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                        {"url" in subItem ? (
                          <a
                            href={subItem.url}
                            aria-current={subItem.isActive ? "page" : undefined}
                          >
                            <span>{subItem.title}</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="w-full text-left"
                            onClick={subItem.onSelect}
                            aria-current={subItem.isActive ? "page" : undefined}
                          >
                            <span>{subItem.title}</span>
                          </button>
                        )}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
