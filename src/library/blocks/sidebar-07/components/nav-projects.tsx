"use client";

import { useRef } from "react";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  StarOff,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../../ui/sidebar";

type SidebarProject = {
  name: string;
  icon: LucideIcon;
} & (
  | { url: string }
  | {
      id: number;
      onOpen: (trigger: HTMLButtonElement | null) => void;
      onShare: (trigger: HTMLButtonElement | null) => void;
      onUnpin: () => void;
    }
);

export function NavProjects({
  projects,
  label = "项目",
  onMore,
}: {
  projects: SidebarProject[];
  label?: string;
  onMore?: () => void;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <NavProject key={"id" in item ? item.id : item.name} item={item} />
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton
            className="text-sidebar-foreground/70"
            onClick={onMore}
          >
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>{onMore ? "查看全部项目" : "更多"}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavProject({ item }: { item: SidebarProject }) {
  const { isMobile } = useSidebar();
  const menuTrigger = useRef<HTMLButtonElement>(null);

  return (
    <SidebarMenuItem>
      {"url" in item ? (
        <SidebarMenuButton asChild>
          <a href={item.url}>
            <item.icon />
            <span>{item.name}</span>
          </a>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          onClick={(event) => item.onOpen(event.currentTarget)}
        >
          <item.icon />
          <span>{item.name}</span>
        </SidebarMenuButton>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            ref={menuTrigger}
            showOnHover
            aria-label={"id" in item ? `${item.name}的更多操作` : undefined}
          >
            <MoreHorizontal />
            <span className="sr-only">更多</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem
            onSelect={
              "onOpen" in item
                ? () => item.onOpen(menuTrigger.current)
                : undefined
            }
          >
            <Folder className="text-muted-foreground" />
            <span>查看项目</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={
              "onShare" in item
                ? () => item.onShare(menuTrigger.current)
                : undefined
            }
          >
            <Forward className="text-muted-foreground" />
            <span>分享项目</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {"onUnpin" in item ? (
            <DropdownMenuItem onSelect={item.onUnpin}>
              <StarOff className="text-muted-foreground" />
              <span>取消收藏</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Trash2 className="text-muted-foreground" />
              <span>删除项目</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
