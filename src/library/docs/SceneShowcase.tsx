import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import {
  Bell,
  FolderKanban,
  Layers3,
  Palette,
  FileText,
  Blocks,
  UserRound,
  Star,
  CalendarDays,
  Users,
  Settings,
  MoreHorizontal,
  Plus,
  Search,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { NavProjects } from "../blocks/sidebar-07/components/nav-projects";
import { TeamSwitcher } from "../blocks/sidebar-07/components/team-switcher";
import { NavMain } from "../blocks/sidebar-07/components/nav-main";
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
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
const teams = [
  { name: "设计组", logo: Palette, plan: "品牌与界面设计" },
  { name: "内容组", logo: FileText, plan: "内容策划与编辑" },
  { name: "产品组", logo: Blocks, plan: "产品体验与交付" },
];
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
    team: "设计组",
    action: "更新了「品牌网站改版」的交付进度",
    time: "今天 10:42",
  },
  {
    owner: "许言",
    team: "内容组",
    action: "完成了「活动素材归档」",
    time: "今天 09:15",
  },
  {
    owner: "周宁",
    team: "内容组",
    action: "创建了「十二月内容计划」",
    time: "昨天 16:30",
  },
];

const pages = [
  {
    id: "overview",
    label: "项目工作台",
    nav: "总览",
    description: "查看团队的项目、交付进度与近期动态。",
  },
  {
    id: "projects",
    label: "团队项目",
    nav: "项目",
    description: "查找项目、查看详情和更新状态。",
  },
  {
    id: "delivery",
    label: "交付计划",
    nav: "交付",
    description: "查看项目交付日期和待交付事项。",
  },
  {
    id: "activity",
    label: "团队活动",
    nav: "活动",
    description: "查看团队创建项目和推进交付的记录。",
  },
  {
    id: "settings",
    label: "工作室设置",
    nav: "设置",
    description: "管理工作室名称与交付提醒。",
  },
  {
    id: "members",
    label: "团队成员",
    nav: "成员",
    description: "查看团队分工与项目负责人。",
  },
  {
    id: "notifications",
    label: "通知中心",
    nav: "通知",
    description: "查看项目交付提醒。",
  },
  {
    id: "profile",
    label: "个人资料",
    nav: "我的资料",
    description: "查看你在工作室里的身份和偏好。",
  },
] as const;

type WorkspacePage = (typeof pages)[number]["id"];

type ProjectFilter = "全部" | Status | "收藏";
type WorkspaceDestination = {
  page: WorkspacePage;
  filter?: ProjectFilter;
  title?: string;
};

const workspaceGroups: {
  title: string;
  icon: typeof FolderKanban;
  items: WorkspaceDestination[];
}[] = [
  {
    title: "项目管理",
    icon: FolderKanban,
    items: [
      { page: "overview" },
      { page: "projects", filter: "全部" },
      { page: "projects", filter: "计划中", title: "计划中的项目" },
      { page: "projects", filter: "进行中", title: "进行中的项目" },
      { page: "projects", filter: "已完成", title: "已完成项目" },
    ],
  },
  {
    title: "团队协作",
    icon: CalendarDays,
    items: [{ page: "delivery" }, { page: "activity" }],
  },
  {
    title: "团队资源",
    icon: Users,
    items: [
      { page: "members" },
      { page: "projects", filter: "收藏", title: "收藏项目" },
    ],
  },
  {
    title: "工作室管理",
    icon: Settings,
    items: [
      { page: "settings" },
      { page: "notifications" },
      { page: "profile" },
    ],
  },
];

type ProjectAction = {
  project: Project;
  mode: "details" | "share";
  trigger: HTMLButtonElement | null;
};

function WorkspaceSidebar({
  workspace,
  page,
  filter,
  teamIndex,
  projectShortcuts,
  onNavigate,
  onSelectTeam,
  onProjectAction,
  onUnpin,
  reminders,
  onRemindersChange,
}: {
  workspace: string;
  page: WorkspacePage;
  filter: ProjectFilter;
  teamIndex: number;
  projectShortcuts: Project[];
  onNavigate: (destination: WorkspaceDestination) => void;
  onSelectTeam: (teamIndex: number) => void;
  onProjectAction: (action: ProjectAction) => void;
  onUnpin: (project: Project) => void;
  reminders: boolean;
  onRemindersChange: (value: boolean) => void;
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  function closeDrawer() {
    if (isMobile) setOpenMobile(false);
  }

  function navigate(destination: WorkspaceDestination) {
    onNavigate(destination);
    closeDrawer();
  }

  function openProject(
    project: Project,
    mode: ProjectAction["mode"],
    trigger: HTMLButtonElement | null,
  ) {
    closeDrawer();
    onProjectAction({ project, mode, trigger: isMobile ? null : trigger });
  }

  function isCurrent(destination: WorkspaceDestination) {
    return (
      page === destination.page &&
      (destination.filter === undefined || filter === destination.filter)
    );
  }

  return (
    <Sidebar collapsible="icon">
      <div
        data-slot="workspace-sidebar"
        className="flex min-h-0 flex-1 flex-col"
      >
        <SidebarHeader className="shrink-0">
          <div className="flex items-center gap-1">
            <TeamSwitcher
              teams={[
                { name: workspace, plan: "全部团队", logo: Layers3 },
                ...teams,
              ]}
              selection={{
                index: teamIndex,
                onChange: (index) => {
                  onSelectTeam(index);
                  closeDrawer();
                },
                onManage: () => navigate({ page: "members" }),
              }}
            />
            {isMobile && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="关闭工作室导航"
                onClick={closeDrawer}
              >
                <X />
              </Button>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <nav aria-label="工作室导航">
            <NavMain
              label="工作台"
              items={workspaceGroups.map(({ title, icon, items }) => ({
                title,
                icon,
                isActive: items.some(isCurrent),
                items: items.map((destination) => ({
                  title:
                    destination.title ??
                    pages.find(({ id }) => id === destination.page)!.nav,
                  isActive: isCurrent(destination),
                  onSelect: () => navigate(destination),
                })),
              }))}
            />
            <NavProjects
              label="项目快捷区"
              projects={projectShortcuts.map((project) => ({
                id: project.id,
                name: project.name,
                icon: Star,
                onOpen: (trigger) => openProject(project, "details", trigger),
                onShare: (trigger) => openProject(project, "share", trigger),
                onUnpin: () => onUnpin(project),
              }))}
              onMore={() => navigate({ page: "projects", filter: "全部" })}
            />
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
                  <DropdownMenuItem
                    onSelect={() => navigate({ page: "profile" })}
                  >
                    <UserRound />
                    我的资料
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => navigate({ page: "settings" })}
                  >
                    <Settings />
                    工作室设置
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => navigate({ page: "notifications" })}
                  >
                    <Bell />
                    通知中心
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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

function ProjectDetails({
  project,
  onCloseAutoFocus,
}: {
  project: Project;
  onCloseAutoFocus?: (event: Event) => void;
}) {
  return (
    <DialogContent onCloseAutoFocus={onCloseAutoFocus}>
      <DialogHeader>
        <DialogTitle className="wrap-anywhere">{project.name}</DialogTitle>
        <DialogDescription>
          {project.team} · {project.owner}负责
        </DialogDescription>
      </DialogHeader>
      <p className="text-sm">交付日：{dueLabel(project.due)}</p>
      <div className="flex items-center gap-3">
        <Badge variant="secondary">{project.status}</Badge>
        <Progress value={project.progress} aria-label="项目进度" />
        <span className="text-sm">{project.progress}%</span>
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
  );
}

export function SceneShowcase() {
  const [page, setPage] = useState<WorkspacePage>("overview");
  const currentPage = pages.find((item) => item.id === page)!;
  const [workspace, setWorkspace] = useState("青禾工作室");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [reminders, setReminders] = useState(true);
  const [projects, setProjects] = useState(initialProjects);
  const [filter, setFilter] = useState<ProjectFilter>("全部");
  const [pinnedIds, setPinnedIds] = useState([1, 2, 3]);
  const [teamIndex, setTeamIndex] = useState(0);
  const [projectAction, setProjectAction] = useState<ProjectAction>();
  const summaryField = useRef<HTMLTextAreaElement>(null);
  const sidebarTrigger = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [team, setTeam] = useState("设计组");
  const [description, setDescription] = useState("");
  const [activity, setActivity] = useState(initialActivity);
  const [unread, setUnread] = useState(true);
  const activeTeam = teams[teamIndex - 1]?.name;
  const searchQuery = query.trim().toLowerCase();
  const teamProjects = activeTeam
    ? projects.filter((project) => project.team === activeTeam)
    : projects;
  const pinnedProjects = teamProjects.filter((project) =>
    pinnedIds.includes(project.id),
  );
  const visible = teamProjects.filter(
    (project) =>
      (filter === "全部" ||
        (filter === "收藏"
          ? pinnedIds.includes(project.id)
          : project.status === filter)) &&
      [project.name, project.team, project.owner].some((value) =>
        value.toLowerCase().includes(searchQuery),
      ),
  );
  const milestones = teamProjects
    .filter((project) => project.status !== "已完成" && project.due)
    .sort((a, b) => (a.due ?? "").localeCompare(b.due ?? ""));
  const scheduled = selectedDate
    ? teamProjects.filter(
        (project) =>
          project.due &&
          dueLabel(project.due) === deliveryDate.format(selectedDate) &&
          selectedDate.getFullYear() === Number(project.due.slice(0, 4)),
      )
    : milestones;
  const teamActivity = activeTeam
    ? activity.filter((entry) => entry.team === activeTeam)
    : activity;

  function navigate({
    page: destination,
    filter: projectFilter,
  }: WorkspaceDestination) {
    if (projectFilter) {
      setFilter(projectFilter);
      setQuery("");
    }
    setPage(destination);
  }

  function selectTeam(index: number) {
    setTeamIndex(index);
    setTeam(teams[index - 1]?.name ?? teams[0].name);
    setQuery("");
    setSelectedDate(undefined);
  }

  function togglePinned(project: Project) {
    const pinned = pinnedIds.includes(project.id);
    setPinnedIds((ids) =>
      pinned ? ids.filter((id) => id !== project.id) : [...ids, project.id],
    );
    toast.success(pinned ? "已取消收藏" : "已收藏项目");
  }

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
      {
        owner: "林沐",
        team: project.team,
        action: `创建了「${project.name}」`,
        time: "刚刚",
      },
      ...items,
    ]);
    setQuery("");
    setFilter("全部");
    setCreating(false);
    setPage("projects");
    setName("");
    if (activeTeam && team !== activeTeam) selectTeam(0);
    else setTeam(activeTeam ?? teams[0].name);
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
        team: project.team,
        action: `将「${project.name}」设为${status}`,
        time: "刚刚",
      },
      ...items,
    ]);
    toast.success("项目状态已更新");
  }

  const notificationSummary = (
    <>
      <p className="my-2 text-sm text-muted-foreground">
        {unread && reminders
          ? "品牌网站改版将在 11 月 20 日交付。"
          : "没有未读通知。"}
      </p>
      {unread && reminders && (
        <Button variant="secondary" size="sm" onClick={() => setUnread(false)}>
          标为已读
        </Button>
      )}
    </>
  );

  function restoreProjectFocus(event: Event) {
    event.preventDefault();
    const trigger = projectAction?.trigger;
    (trigger?.isConnected && trigger.offsetWidth
      ? trigger
      : sidebarTrigger.current
    )?.focus();
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" } as CSSProperties}>
      <WorkspaceSidebar
        workspace={workspace}
        page={page}
        filter={filter}
        teamIndex={teamIndex}
        projectShortcuts={pinnedProjects.slice(0, 3)}
        onNavigate={navigate}
        onSelectTeam={selectTeam}
        onProjectAction={setProjectAction}
        onUnpin={togglePinned}
        reminders={reminders}
        onRemindersChange={setReminders}
      />
      <SidebarInset className="min-w-0 px-3 pb-3 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
        <div className="flex h-14 shrink-0 items-center gap-2 transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger
            ref={sidebarTrigger}
            aria-label="切换工作室侧栏"
            className="-ml-1"
          />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb aria-label="工作室当前位置">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{currentPage.nav}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <header
          data-slot="workspace-header"
          className="mb-6 flex flex-wrap items-end justify-between gap-4"
        >
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {currentPage.label}
            </h1>
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
                  <span className="relative grid place-items-center">
                    <Bell aria-hidden="true" />
                    {unread && reminders && (
                      <span
                        aria-hidden="true"
                        data-slot="unread-indicator"
                        className="pointer-events-none absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary ring-2 ring-background"
                      />
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="max-w-[calc(100vw-2rem)]">
                <h2 className="font-semibold">通知</h2>
                {notificationSummary}
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
                        {teams.map(({ name: value }) => (
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
                value: teamProjects.length,
                detail: "团队项目总数",
              },
              ...statuses.map((status) => ({
                label: status,
                value: teamProjects.filter((item) => item.status === status)
                  .length,
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
                <CardDescription>
                  整个工作室本周每天完成的任务数
                </CardDescription>
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
                  scheduled: teamProjects.flatMap((project) =>
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
                  {activeTeam ? `${activeTeam} · ` : ""}
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
                  if (value) setFilter(value as ProjectFilter);
                }}
                aria-label="按状态筛选项目"
                className="mb-2 max-w-full flex-wrap"
              >
                {["全部", ...statuses, "收藏"].map((status) => (
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
                          <ProjectDetails project={project} />
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
                            <DropdownMenuItem
                              onSelect={() => togglePinned(project)}
                            >
                              <Star />
                              {pinnedIds.includes(project.id)
                                ? "取消收藏"
                                : "收藏项目"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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
                {teamActivity.length === 0 && (
                  <li className="text-sm text-muted-foreground">
                    暂无项目动态。
                  </li>
                )}
                {(page === "overview"
                  ? teamActivity.slice(0, 3)
                  : teamActivity
                ).map(({ owner, action, time }, index) => (
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
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {page === "members" && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {teams
              .filter(({ name }) => !activeTeam || name === activeTeam)
              .map(({ name, plan, logo: Icon }) => (
                <Card key={name} className="gap-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="size-4" />
                      {name}
                    </CardTitle>
                    <CardDescription>{plan}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y">
                      {[
                        ...new Set(
                          projects
                            .filter((project) => project.team === name)
                            .map(({ owner }) => owner),
                        ),
                      ].map((owner) => (
                        <li
                          key={owner}
                          className="flex items-center gap-2 py-2 text-sm"
                        >
                          <Avatar className="size-7">
                            <AvatarFallback>{owner[0]}</AvatarFallback>
                          </Avatar>
                          <span>{owner}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
        {page === "notifications" && (
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>项目提醒</CardTitle>
            </CardHeader>
            <CardContent>{notificationSummary}</CardContent>
          </Card>
        )}
        {page === "profile" && (
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>林</AvatarFallback>
                </Avatar>
                林沐
              </CardTitle>
              <CardDescription>{workspace} · 工作室管理员</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => navigate({ page: "settings" })}
              >
                管理交付提醒
              </Button>
            </CardContent>
          </Card>
        )}
        <Dialog
          open={Boolean(projectAction)}
          onOpenChange={(open) => {
            if (!open) setProjectAction(undefined);
          }}
        >
          {projectAction?.mode === "details" && (
            <ProjectDetails
              project={projectAction.project}
              onCloseAutoFocus={restoreProjectFocus}
            />
          )}
          {projectAction?.mode === "share" && (
            <DialogContent onCloseAutoFocus={restoreProjectFocus}>
              <DialogHeader>
                <DialogTitle>分享项目</DialogTitle>
                <DialogDescription>
                  {projectAction.project.name}
                </DialogDescription>
              </DialogHeader>
              <Textarea
                ref={summaryField}
                aria-label="项目摘要"
                readOnly
                value={`${projectAction.project.name}
${projectAction.project.team} · ${projectAction.project.owner}
${projectAction.project.status} · 交付日：${dueLabel(projectAction.project.due)}`}
              />
              <DialogFooter>
                <Button
                  onClick={async () => {
                    const summary = summaryField.current;
                    if (!summary) return;
                    try {
                      await navigator.clipboard.writeText(summary.value);
                      toast.success("已复制项目摘要");
                    } catch {
                      summary.select();
                      toast.info("可手动复制选中的摘要");
                    }
                  }}
                >
                  复制摘要
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>

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
