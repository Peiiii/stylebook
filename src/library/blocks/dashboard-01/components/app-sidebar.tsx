"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "./nav-documents"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../ui/sidebar"

const data = {
  user: {
    name: "林沐",
    email: "m@example.com",
    avatar: `${import.meta.env.BASE_URL}avatars/shadcn.jpg`,
  },
  navMain: [
    {
      title: "仪表盘",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "生命周期",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "分析",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "项目",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "团队",
      url: "#",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "采集",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "进行中的提案",
          url: "#",
        },
        {
          title: "已归档",
          url: "#",
        },
      ],
    },
    {
      title: "提案",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "进行中的提案",
          url: "#",
        },
        {
          title: "已归档",
          url: "#",
        },
      ],
    },
    {
      title: "提示词",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "进行中的提案",
          url: "#",
        },
        {
          title: "已归档",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "设置",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "获取帮助",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "搜索",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "资料库",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "报告",
      url: "#",
      icon: IconReport,
    },
    {
      name: "写作助手",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">星河科技</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
