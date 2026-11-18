"use client"

import * as React from "react"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"

import { useIsMobile } from "../hooks/use-mobile"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "用于展示需要确认的重要内容，并等待用户操作。",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "悬停时预览链接相关的内容。",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "以进度条展示任务的完成情况。",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "在有限空间中浏览较长的内容。",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "在同一区域切换多组内容，每次展示一个面板。",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "在鼠标悬停或键盘聚焦时，补充简短说明。",
  },
]

export default function NavigationMenuDemo() {
  const isMobile = useIsMobile()

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem>
          <NavigationMenuTrigger>首页</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                    href="/"
                  >
                    <div className="mb-2 text-lg font-medium sm:mt-4">
                      shadcn/ui
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      浏览组件、选择风格，搭建一致的产品界面。
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="产品简介">
                组件源码可复用，支持按需要组合与调整。
              </ListItem>
              <ListItem href="/docs/installation" title="开始使用">
                了解依赖安装和项目目录结构。
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="文字排版">
                查看标题、正文与列表的排版方式。
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>组件</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="/docs">文档</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>浏览</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">组件</div>
                    <div className="text-muted-foreground">
                      查看组件库中的全部组件。
                    </div>
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">使用文档</div>
                    <div className="text-muted-foreground">
                      了解组件的使用方式。
                    </div>
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">文章</div>
                    <div className="text-muted-foreground">
                      阅读最新的产品与设计文章。
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>简洁导航</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#">组件</a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">使用文档</a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">页面模板</a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>图标导航</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleHelpIcon />
                    待规划
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleIcon />
                    待处理
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleCheckIcon />
                    已完成
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <a href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
