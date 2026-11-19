import { lazy, Suspense, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Inbox,
  ListTodo,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

function ExampleHeading({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children?: ReactNode;
}) {
  return (
    <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
        {title}
      </h3>
      {children}
    </header>
  );
}

const reviewTimes = ["周二 14:00", "周三 10:00", "周五 15:00"];

function ReviewExample() {
  const [confirmation, setConfirmation] = useState("");
  const clearConfirmation = () => setConfirmation("");

  return (
    <>
      <ExampleHeading title="安排设计评审" icon={CalendarDays}>
        <Badge variant="secondary">{confirmation ? "已安排" : "草稿"}</Badge>
      </ExampleHeading>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          const project = String(values.get("project") ?? "").trim();
          if (!project) return;
          const reminders = values.has("reminder")
            ? "已开启提醒"
            : "提醒已关闭";
          setConfirmation(
            `已安排「${project}」的演示评审。 ${values.get("time")} · ${reminders}`,
          );
        }}
      >
        <div className="grid gap-3 min-[420px]:grid-cols-2">
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="home-project">项目名称</Label>
            <Input
              id="home-project"
              name="project"
              defaultValue="品牌网站改版"
              required
              maxLength={40}
              onChange={clearConfirmation}
            />
          </div>
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="home-review-time">评审时间</Label>
            <Select
              name="time"
              defaultValue={reviewTimes[0]}
              onValueChange={clearConfirmation}
            >
              <SelectTrigger id="home-review-time" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reviewTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex items-center gap-2">
            <Switch
              id="home-review-reminder"
              name="reminder"
              defaultChecked
              onCheckedChange={clearConfirmation}
            />
            <Label htmlFor="home-review-reminder">启用提醒</Label>
          </div>
          <Button type="submit" size="sm">
            确认评审
          </Button>
        </div>
        {confirmation && (
          <p
            role="status"
            className="wrap-anywhere text-sm text-muted-foreground"
          >
            {confirmation}
          </p>
        )}
      </form>
    </>
  );
}

const work = [
  { name: "品牌网站", status: "进行中", progress: 72 },
  { name: "设计规范", status: "已完成", progress: 100 },
  { name: "上手引导", status: "待开始", progress: 0 },
];

function ProjectsExample() {
  const [status, setStatus] = useState("全部");
  const visible =
    status === "全部" ? work : work.filter((item) => item.status === status);
  return (
    <>
      <ExampleHeading title="项目进度" icon={ListTodo}>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger size="sm" aria-label="筛选项目状态">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["全部", "进行中", "已完成", "待开始"].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ExampleHeading>
      <ul className="divide-y">
        {visible.map((item) => (
          <li
            key={item.name}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-3 first:pt-0"
          >
            <span className="text-sm font-medium">{item.name}</span>
            <Badge variant={item.status === "进行中" ? "secondary" : "outline"}>
              {item.status}
            </Badge>
            <Progress
              className="h-1.5"
              value={item.progress}
              aria-label={`${item.name}完成进度`}
            />
            <span className="text-right text-xs text-muted-foreground tabular-nums">
              {item.progress}%
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

const members = [
  { name: "林沐", team: "工作室负责人", role: "所有者" },
  { name: "沈青", team: "产品设计", role: "可编辑" },
  { name: "周宁", team: "内容策划", role: "仅查看" },
];

function MembersExample() {
  return (
    <>
      <ExampleHeading title="团队权限" icon={Users}>
        <Badge variant="secondary">{members.length} 位成员</Badge>
      </ExampleHeading>
      <ul className="divide-y">
        {members.map(({ name, team, role }) => (
          <li
            key={name}
            className="flex min-h-13 items-center gap-3 py-2 first:pt-0"
          >
            <Avatar className="size-8">
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">{team}</div>
            </div>
            {role === "所有者" ? (
              <Badge variant="outline">所有者</Badge>
            ) : (
              <Select defaultValue={role}>
                <SelectTrigger size="sm" aria-label={`${name}的权限`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="可编辑">可编辑</SelectItem>
                  <SelectItem value="仅查看">仅查看</SelectItem>
                </SelectContent>
              </Select>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

const messages = [
  { title: "迭代评审即将开始", detail: "周五 15:00，会议材料已放到项目文档。" },
  { title: "首页设计稿已更新", detail: "已经补齐窄屏布局，可以开始检查交互。" },
  { title: "交付清单已整理", detail: "记得确认图标、状态文案与无障碍名称。" },
];

function InboxExample() {
  const [unread, setUnread] = useState(
    messages.slice(0, 2).map(({ title }) => title),
  );
  return (
    <>
      <ExampleHeading title="消息收件箱" icon={Inbox}>
        <Button
          variant="ghost"
          size="sm"
          disabled={unread.length === 0}
          onClick={() => setUnread([])}
        >
          全部已读
        </Button>
      </ExampleHeading>
      <Accordion
        type="single"
        collapsible
        onValueChange={(title) =>
          setUnread((items) => items.filter((item) => item !== title))
        }
      >
        {messages.map(({ title, detail }) => (
          <AccordionItem key={title} value={title}>
            <AccordionTrigger className="items-center py-3">
              <span className="flex min-w-0 flex-1 items-center gap-2">
                {title}
                {unread.includes(title) && (
                  <Badge variant="secondary">未读</Badge>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {detail}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

const CalendarExample = lazy(() => import("./HomeExampleCalendar"));

const examples = [
  {
    id: "review",
    letter: "A",
    label: "评审",
    name: "设计评审",
    Content: ReviewExample,
  },
  {
    id: "projects",
    letter: "B",
    label: "进度",
    name: "项目进度",
    Content: ProjectsExample,
  },
  {
    id: "members",
    letter: "C",
    label: "权限",
    name: "团队权限",
    Content: MembersExample,
  },
  {
    id: "inbox",
    letter: "D",
    label: "消息",
    name: "消息收件箱",
    Content: InboxExample,
  },
  {
    id: "calendar",
    letter: "E",
    label: "日历",
    name: "交付日历",
    Content: CalendarExample,
  },
] as const;

export function HomeExamples() {
  return (
    <Tabs
      defaultValue="review"
      data-home-examples=""
      className="min-w-0 md:col-start-2 md:row-start-1"
    >
      <div className="overflow-x-auto px-0.5">
        <TabsList aria-label="首页组件展示候选" className="w-max p-1">
          {examples.map(({ id, letter, label, name }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="px-2 text-xs sm:px-3"
              aria-label={`${letter} · ${name}`}
            >
              {letter} {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {examples.map(({ id, Content }) => (
        <TabsContent
          key={id}
          value={id}
          forceMount={id === "calendar" ? undefined : true}
          className="min-w-0 rounded-(--atlas-surface-radius) border bg-card p-4 shadow-(--atlas-surface-shadow) data-[state=inactive]:hidden sm:p-5"
        >
          <Suspense
            fallback={
              <div
                role="status"
                aria-label="正在加载展示"
                className="min-h-54"
              />
            }
          >
            <Content />
          </Suspense>
        </TabsContent>
      ))}
    </Tabs>
  );
}
