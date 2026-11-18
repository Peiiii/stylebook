import { useState, type CSSProperties, type FormEvent } from "react";
import {
  Bell,
  FolderKanban,
  Layers3,
  CalendarDays,
  LayoutDashboard,
  History,
  Settings,
  MoreHorizontal,
  Plus,
  Search,
  ChevronDown,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";

const statuses = ["计划中", "进行中", "已完成"] as const;
type Status = (typeof statuses)[number];
type Project = {
  id: number;
  name: string;
  team: string;
  owner: string;
  status: Status;
  progress: number;
  due?: string;
  description?: string;
};
const initialProjects: Project[] = [
  {
    id: 1,
    name: "品牌网站改版",
    team: "设计组",
    owner: "林沐",
    status: "进行中",
    progress: 72,
    due: "2026-11-20",
  },
  {
    id: 2,
    name: "十二月内容计划",
    team: "内容组",
    owner: "周宁",
    status: "计划中",
    progress: 15,
    due: "2026-11-24",
  },
  {
    id: 3,
    name: "新手引导优化",
    team: "产品组",
    owner: "沈青",
    status: "进行中",
    progress: 45,
    due: "2026-11-27",
  },
  {
    id: 4,
    name: "活动素材归档",
    team: "内容组",
    owner: "许言",
    status: "已完成",
    progress: 100,
    due: "2026-11-18",
  },
  {
    id: 5,
    name: "帮助中心梳理",
    team: "产品组",
    owner: "陈雨",
    status: "计划中",
    progress: 0,
    due: "2026-12-02",
  },
];
const deliveryDate = new Intl.DateTimeFormat("zh-CN", {
  month: "long",
  day: "numeric",
});

function dueLabel(due?: string) {
  return due ? deliveryDate.format(new Date(due + "T00:00:00")) : "待安排";
}

const weeklyDelivery = [3, 5, 4, 7, 6, 9, 8];
const initialActivity = [
  {
    owner: "林沐",
    action: "更新了「品牌网站改版」的交付进度",
    time: "今天 10:42",
  },
  { owner: "许言", action: "完成了「活动素材归档」", time: "今天 09:15" },
  { owner: "周宁", action: "创建了「十二月内容计划」", time: "昨天 16:30" },
];

const pages = [
  {
    id: "overview",
    label: "项目工作台",
    nav: "总览",
    icon: LayoutDashboard,
    description: "查看团队的项目、交付进度与近期动态。",
  },
  {
    id: "projects",
    label: "团队项目",
    nav: "项目",
    icon: FolderKanban,
    description: "查找项目、查看详情和更新状态。",
  },
  {
    id: "delivery",
    label: "交付计划",
    nav: "交付",
    icon: CalendarDays,
    description: "查看项目交付日期和待交付事项。",
  },
  {
    id: "activity",
    label: "团队活动",
    nav: "活动",
    icon: History,
    description: "查看团队创建项目和推进交付的记录。",
  },
  {
    id: "settings",
    label: "工作室设置",
    nav: "设置",
    icon: Settings,
    description: "管理工作室名称与交付提醒。",
  },
] as const;

type WorkspacePage = (typeof pages)[number]["id"];

const workspaceGroups = [
  { label: "工作台", pages: ["overview", "projects"] },
  { label: "协作", pages: ["delivery", "activity"] },
] as const;

function WorkspaceSidebar({
  workspace,
  page,
  onNavigate,
  reminders,
  onRemindersChange,
}: {
  workspace: string;
  page: WorkspacePage;
  onNavigate: (page: WorkspacePage) => void;
  reminders: boolean;
  onRemindersChange: (value: boolean) => void;
}) {
  const { isMobile, open, setOpenMobile } = useSidebar();

  function navigate(target: WorkspacePage) {
    onNavigate(target);
    if (isMobile) setOpenMobile(false);
  }

  function renderPage({ id, nav, icon: Icon }: (typeof pages)[number]) {
    return (
      <SidebarMenuItem key={id}>
        <SidebarMenuButton
          isActive={page === id}
          aria-current={page === id ? "page" : undefined}
          aria-label={nav}
          tooltip={nav}
          onClick={() => navigate(id)}
        >
          <Icon />
          <span>{nav}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <div
        data-slot="workspace-sidebar"
        className="flex min-h-0 flex-1 flex-col"
      >
        <SidebarHeader className="shrink-0">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2 px-1 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                <Layers3 className="size-4" />
              </div>
              <strong className="min-w-0 flex-1 truncate text-sm group-data-[collapsible=icon]:sr-only">
                {workspace}
              </strong>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="关闭工作室导航"
                  onClick={() => setOpenMobile(false)}
                >
                  <X />
                </Button>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <nav aria-label="工作室导航">
            {workspaceGroups.map(({ label, pages: groupPages }) => (
              <Collapsible
                key={label}
                defaultOpen
                className="group/workspace-group"
              >
                <SidebarGroup className="group-data-[collapsible=icon]:py-1">
                  <CollapsibleTrigger asChild>
                    <SidebarGroupLabel
                      asChild
                      className="group-data-[collapsible=icon]:hidden"
                    >
                      <button
                        type="button"
                        className="cursor-pointer justify-between"
                      >
                        {label}
                        <ChevronDown className="transition-transform group-data-[state=closed]/workspace-group:-rotate-90" />
                      </button>
                    </SidebarGroupLabel>
                  </CollapsibleTrigger>
                  <CollapsibleContent
                    forceMount
                    className={
                      isMobile || open
                        ? "data-[state=closed]:hidden"
                        : undefined
                    }
                  >
                    <SidebarMenu>
                      {pages
                        .filter(({ id }) =>
                          (groupPages as readonly WorkspacePage[]).includes(id),
                        )
                        .map(renderPage)}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ))}
            <SidebarGroup className="group-data-[collapsible=icon]:py-1">
              <SidebarMenu>
                {pages.filter(({ id }) => id === "settings").map(renderPage)}
              </SidebarMenu>
            </SidebarGroup>
          </nav>
        </SidebarContent>
        <SidebarFooter className="shrink-0 border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    tooltip="林沐的账户菜单"
                    aria-label="林沐的账户菜单"
                  >
                    <Avatar className="size-8 shrink-0 rounded-md">
                      <AvatarFallback className="rounded-md text-foreground">
                        林
                      </AvatarFallback>
                    </Avatar>
                    <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                      <strong className="truncate font-medium">林沐</strong>
                      <span className="truncate text-xs opacity-70">
                        工作室管理员
                      </span>
                    </span>
                    <ChevronsUpDown className="ml-auto size-4 opacity-70 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side={isMobile ? "top" : "right"}
                  align="end"
                  className="w-48"
                >
                  <DropdownMenuLabel>林沐</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate("settings")}>
                    <Settings />
                    工作室设置
                  </DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={reminders}
                    onCheckedChange={onRemindersChange}
                  >
                    交付提醒
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}

export function SceneShowcase() {
  const [page, setPage] = useState<WorkspacePage>("overview");
  const currentPage = pages.find((item) => item.id === page)!;
  const [workspace, setWorkspace] = useState("青禾工作室");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [reminders, setReminders] = useState(true);
  const [projects, setProjects] = useState(initialProjects);
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [team, setTeam] = useState("设计组");
  const [description, setDescription] = useState("");
  const [activity, setActivity] = useState(initialActivity);
  const [unread, setUnread] = useState(true);
  const visible = projects.filter(
    (project) =>
      (filter === "全部" || project.status === filter) &&
      [project.name, project.team, project.owner].some((value) =>
        value.toLowerCase().includes(query.trim().toLowerCase()),
      ),
  );
  const milestones = projects
    .filter((project) => project.status !== "已完成" && project.due)
    .sort((a, b) => (a.due ?? "").localeCompare(b.due ?? ""));
  const scheduled = selectedDate
    ? projects.filter(
        (project) =>
          project.due &&
          dueLabel(project.due) === deliveryDate.format(selectedDate) &&
          selectedDate.getFullYear() === Number(project.due.slice(0, 4)),
      )
    : milestones;

  function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    const project = {
      id: Math.max(...projects.map((item) => item.id)) + 1,
      name: name.trim(),
      team,
      owner: "林沐",
      status: "计划中" as const,
      progress: 0,
      due:
        String(new FormData(event.currentTarget).get("due") || "") || undefined,
      description: description.trim(),
    };
    setProjects([project, ...projects]);
    setActivity((items) => [
      { owner: "林沐", action: `创建了「${project.name}」`, time: "刚刚" },
      ...items,
    ]);
    setQuery("");
    setFilter("全部");
    setCreating(false);
    setPage("projects");
    setName("");
    setTeam("设计组");
    setDescription("");
    toast.success("项目已创建");
  }

  function changeStatus(project: Project, status: Status) {
    setProjects(
      projects.map((item) =>
        item.id === project.id
          ? {
              ...item,
              status,
              progress:
                status === "已完成"
                  ? 100
                  : item.status === "已完成"
                    ? 0
                    : item.progress,
            }
          : item,
      ),
    );
    setActivity((items) => [
      {
        owner: "林沐",
        action: `将「${project.name}」设为${status}`,
        time: "刚刚",
      },
      ...items,
    ]);
    toast.success("项目状态已更新");
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "13rem" } as CSSProperties}>
      <WorkspaceSidebar
        workspace={workspace}
        page={page}
        onNavigate={setPage}
        reminders={reminders}
        onRemindersChange={setReminders}
      />
      <SidebarInset className="min-w-0 p-3 sm:p-6 lg:p-8">
        <header
          data-slot="workspace-header"
          className="mb-6 flex flex-wrap items-end justify-between gap-4"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger
                aria-label="切换工作室侧栏"
                className="size-8 shrink-0"
              />
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {currentPage.label}
              </h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {currentPage.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={unread && reminders ? "通知，有未读" : "通知"}
                >
                  <Bell />
                  {unread && reminders && (
                    <span className="size-1.5 rounded-full bg-primary" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="max-w-[calc(100vw-2rem)]">
                <h2 className="font-semibold">通知</h2>
                <p className="my-2 text-sm text-muted-foreground">
                  {unread && reminders
                    ? "品牌网站改版将在 11 月 20 日交付。"
                    : "没有未读通知。"}
                </p>
                {unread && reminders && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setUnread(false)}
                  >
                    标为已读
                  </Button>
                )}
              </PopoverContent>
            </Popover>
            <Dialog open={creating} onOpenChange={setCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus />
                  新建项目
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90svh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>新建项目</DialogTitle>
                  <DialogDescription>
                    填写名称并选择负责团队。
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={createProject} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="scene-name">项目名称</Label>
                    <Input
                      id="scene-name"
                      required
                      maxLength={40}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="scene-team">负责团队</Label>
                    <Select value={team} onValueChange={setTeam}>
                      <SelectTrigger id="scene-team" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["设计组", "内容组", "产品组"].map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="scene-description">项目说明</Label>
                    <Textarea
                      id="scene-description"
                      value={description}
                      maxLength={240}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="scene-due">交付日期</Label>
                    <Input type="date" id="scene-due" name="due" />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        取消
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={!name.trim()}>
                      创建项目
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {page === "overview" && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "全部项目",
                value: projects.length,
                detail: "团队项目总数",
              },
              ...statuses.map((status) => ({
                label: status,
                value: projects.filter((item) => item.status === status).length,
                detail: {
                  计划中: "等待排期或启动",
                  进行中: "正在推进",
                  已完成: "已交付归档",
                }[status],
              })),
            ].map(({ label, value, detail }) => (
              <Card key={label} className="gap-2 py-4">
                <CardHeader className="px-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <p className="text-3xl font-semibold tabular-nums">{value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {page === "overview" && (
          <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Card className="gap-4">
              <CardHeader>
                <CardTitle>交付趋势</CardTitle>
                <CardDescription>本周每天完成的任务数</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="grid grid-cols-7 gap-2 sm:gap-5"
                  role="img"
                  aria-label={weeklyDelivery
                    .map(
                      (count, index) =>
                        `周${"一二三四五六日"[index]}完成 ${count} 项`,
                    )
                    .join("，")}
                >
                  {weeklyDelivery.map((count, index) => (
                    <div
                      key={index}
                      className="grid min-w-0 justify-items-center gap-2"
                      aria-hidden="true"
                    >
                      <div className="flex h-24 w-full max-w-14 items-end rounded-md bg-muted">
                        <div
                          className="flex w-full items-start justify-center rounded-md bg-primary pt-1 text-xs font-medium text-primary-foreground"
                          style={{ height: `${count * 10}%` }}
                        >
                          {count}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        周{"一二三四五六日"[index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="gap-4">
              <CardHeader>
                <CardTitle>近期交付</CardTitle>
                <CardDescription>关注接下来的项目节点</CardDescription>
              </CardHeader>
              <CardContent className="divide-y">
                {milestones.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <span className="min-w-0 truncate text-sm">
                      {project.name}
                    </span>
                    <Badge variant="outline" className="shrink-0">
                      {dueLabel(project.due)}
                    </Badge>
                  </div>
                ))}
                {milestones.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    暂无待交付项目。
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {page === "delivery" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>交付日历</CardTitle>
              <CardDescription>选择日期查看对应项目。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)]">
              <Calendar
                mode="single"
                defaultMonth={new Date(2026, 10, 1)}
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  scheduled: projects.flatMap((project) =>
                    project.due ? [new Date(project.due + "T00:00:00")] : [],
                  ),
                }}
                modifiersClassNames={{ scheduled: "font-bold text-primary" }}
                className="max-w-full rounded-lg border p-1"
              />
              <div>
                <div className="flex items-center justify-between gap-2 border-b pb-2">
                  <h2 className="text-sm font-semibold">
                    {selectedDate
                      ? deliveryDate.format(selectedDate)
                      : "待交付项目"}
                  </h2>
                  {selectedDate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(undefined)}
                    >
                      查看全部
                    </Button>
                  )}
                </div>
                <ul className="divide-y">
                  {scheduled.map((project) => (
                    <li
                      key={project.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                    >
                      <span>{project.name}</span>
                      <Badge variant="secondary">
                        {dueLabel(project.due)} · {project.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
                {scheduled.length === 0 && (
                  <p className="py-4 text-sm text-muted-foreground">
                    没有安排交付的项目。
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {page === "projects" && (
          <Card data-workspace-projects className="mb-6 min-w-0 gap-4">
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div className="grid gap-1.5">
                <CardTitle>团队项目</CardTitle>
                <CardDescription>
                  按状态浏览，或搜索项目与负责人。
                </CardDescription>
              </div>
              <InputGroup className="w-full sm:w-64">
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupInput
                  aria-label="搜索项目"
                  placeholder="搜索项目或负责人"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </InputGroup>
            </CardHeader>
            <CardContent className="min-w-0">
              <ToggleGroup
                type="single"
                value={filter}
                onValueChange={(value) => {
                  if (value) setFilter(value);
                }}
                aria-label="按状态筛选项目"
                className="mb-2 max-w-full flex-wrap"
              >
                {["全部", ...statuses].map((status) => (
                  <ToggleGroupItem
                    key={status}
                    value={status}
                    className="px-2 sm:px-3"
                  >
                    {status}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>项目</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>负责人</TableHead>
                    <TableHead>交付日</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="link"
                              className="h-auto max-w-56 whitespace-normal p-0 text-left font-semibold"
                            >
                              {project.name}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="wrap-anywhere">
                                {project.name}
                              </DialogTitle>
                              <DialogDescription>
                                {project.team} · {project.owner}负责
                              </DialogDescription>
                            </DialogHeader>
                            <p className="text-sm">
                              交付日：{dueLabel(project.due)}
                            </p>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">
                                {project.status}
                              </Badge>
                              <Progress
                                value={project.progress}
                                aria-label="项目进度"
                              />
                              <span className="text-sm">
                                {project.progress}%
                              </span>
                            </div>
                            {project.description && (
                              <p className="wrap-anywhere text-sm text-muted-foreground">
                                {project.description}
                              </p>
                            )}
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">关闭详情</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <p className="text-xs text-muted-foreground">
                          {project.team}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          data-project-status={project.status}
                          variant={
                            project.status === "进行中"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex min-w-24 items-center gap-2">
                          <Progress
                            value={project.progress}
                            aria-label={`${project.name}的进度`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {project.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-xs">
                              {project.owner[0]}
                            </AvatarFallback>
                          </Avatar>
                          {project.owner}
                        </div>
                      </TableCell>
                      <TableCell>{dueLabel(project.due)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`更新${project.name}的状态`}
                            >
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {statuses.map((status) => (
                              <DropdownMenuItem
                                key={status}
                                disabled={status === project.status}
                                onSelect={() => changeStatus(project, status)}
                              >
                                设为{status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {visible.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-10 text-center text-muted-foreground"
                      >
                        <FolderKanban className="mx-auto mb-2 size-5" />
                        没有匹配的项目
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        {(page === "overview" || page === "activity") && (
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>近期活动</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {(page === "overview" ? activity.slice(0, 3) : activity).map(
                  ({ owner, action, time }, index) => (
                    <li
                      key={`${action}-${index}`}
                      className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <Avatar>
                        <AvatarFallback>{owner[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 text-sm">
                        <strong className="font-medium">{owner}</strong>
                        <p className="text-muted-foreground">{action}</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        {time}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </CardContent>
          </Card>
        )}
        {page === "settings" && (
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>工作室资料</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  const value = String(
                    new FormData(event.currentTarget).get("workspace") ?? "",
                  ).trim();
                  if (value) {
                    setWorkspace(value);
                    toast.success("已保存工作室资料");
                  }
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="scene-workspace">工作室名称</Label>
                  <Input
                    id="scene-workspace"
                    name="workspace"
                    defaultValue={workspace}
                    maxLength={24}
                    required
                  />
                </div>
                <div className="flex items-center justify-between gap-3 border-t pt-4">
                  <div>
                    <Label htmlFor="scene-reminders">交付提醒</Label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      在通知里显示即将到期的项目。
                    </p>
                  </div>
                  <Switch
                    id="scene-reminders"
                    checked={reminders}
                    onCheckedChange={setReminders}
                  />
                </div>
                <Button type="submit" className="justify-self-start">
                  保存资料
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
