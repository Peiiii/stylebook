"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../../../ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "林沐",
    email: "m@example.com",
    avatar: `${import.meta.env.BASE_URL}avatars/shadcn.jpg`,
  },
  teams: [
    {
      name: "星河科技",
      logo: GalleryVerticalEnd,
      plan: "企业版",
    },
    {
      name: "青禾工作室",
      logo: AudioWaveform,
      plan: "初创版",
    },
    {
      name: "远山团队",
      logo: Command,
      plan: "免费版",
    },
  ],
  navMain: [
    {
      title: "试验场",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "历史记录",
          url: "#",
        },
        {
          title: "收藏",
          url: "#",
        },
        {
          title: "设置",
          url: "#",
        },
      ],
    },
    {
      title: "模型",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "基础模型",
          url: "#",
        },
        {
          title: "探索模型",
          url: "#",
        },
        {
          title: "推理模型",
          url: "#",
        },
      ],
    },
    {
      title: "文档",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "简介",
          url: "#",
        },
        {
          title: "开始使用",
          url: "#",
        },
        {
          title: "教程",
          url: "#",
        },
        {
          title: "更新记录",
          url: "#",
        },
      ],
    },
    {
      title: "设置",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "通用",
          url: "#",
        },
        {
          title: "团队",
          url: "#",
        },
        {
          title: "账单",
          url: "#",
        },
        {
          title: "限额",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "设计工程",
      url: "#",
      icon: Frame,
    },
    {
      name: "销售与市场",
      url: "#",
      icon: PieChart,
    },
    {
      name: "差旅",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
