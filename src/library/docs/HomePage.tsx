import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  FileText,
  LayoutDashboard,
  PanelsTopLeft,
  SlidersHorizontal,
} from "lucide-react";
import { themes, type AtlasTheme } from "../themes";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type HomePageProps = {
  theme: AtlasTheme;
  onTheme: (theme: AtlasTheme["id"]) => void;
  href: (values: Record<string, string>) => string;
  counts: { components: number; scenes: number; blocks: number };
};

const quickThemes = [
  { id: "shadcn", label: "默认" },
  { id: "ant", label: "Ant Design" },
  { id: "ios", label: "iOS" },
  { id: "retro", label: "复古" },
] as const;
const reviewTimes = ["周二 14:00", "周三 10:00", "周五 15:00"];

function ThemePreview({
  theme,
  onTheme,
}: Pick<HomePageProps, "theme" | "onTheme">) {
  const [confirmation, setConfirmation] = useState("");
  const clearConfirmation = () => setConfirmation("");

  return (
    <figure
      aria-label="设计评审交互预览"
      className="min-w-0 overflow-hidden rounded-2xl border bg-card shadow-lg shadow-black/5"
    >
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5">
        <span className="flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          风格试验台
        </span>
        <span className="text-xs text-muted-foreground">{theme.label}</span>
      </figcaption>
      <div className="grid place-items-center bg-muted/55 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[14px_14px] px-3 py-5 sm:px-8 sm:py-7">
        <Card className="w-full max-w-sm gap-4 py-4">
          <CardHeader className="flex items-center justify-between gap-2 px-4 sm:px-5">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="size-4 shrink-0 text-primary" />
              安排设计评审
            </CardTitle>
            <Badge variant="secondary">
              {confirmation ? "已安排" : "草稿"}
            </Badge>
          </CardHeader>
          <CardContent className="px-4 sm:px-5">
            <form
              className="grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                const values = new FormData(event.currentTarget);
                const project = String(values.get("project") ?? "").trim();
                if (project) {
                  const reminders = values.has("reminder")
                    ? "已开启提醒"
                    : "提醒已关闭";
                  setConfirmation(
                    `已安排「${project}」的演示评审。 ${values.get("time")} · ${reminders}`,
                  );
                }
              }}
            >
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
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
              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
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
          </CardContent>
        </Card>
      </div>
      <div className="border-t p-2.5 sm:px-4">
        <ToggleGroup
          type="single"
          value={theme.id}
          onValueChange={(value) => {
            const next = quickThemes.find((entry) => entry.id === value);
            if (next) onTheme(next.id);
          }}
          size="sm"
          spacing={1}
          aria-label="试验台风格"
          className="flex w-full flex-wrap justify-start gap-1"
        >
          {quickThemes.map((entry) => (
            <ToggleGroupItem
              key={entry.id}
              value={entry.id}
              className="h-8 px-2.5 text-xs sm:px-3"
            >
              {entry.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </figure>
  );
}

export function HomePage({ theme, onTheme, href, counts }: HomePageProps) {
  const destinations = [
    {
      title: "青禾工作室",
      description: "试试带折叠侧栏、项目管理和交付日历的团队工作台。",
      icon: LayoutDashboard,
      href: href({ view: "scene", scene: "workspace" }),
    },
    {
      title: "Bento · 设计手记",
      description: "看看同一套风格在内容网站里的排版、封面与卡片布局。",
      icon: PanelsTopLeft,
      href: href({ view: "scene", scene: "bento" }),
    },
    {
      title: "页面模板",
      description: `${counts.blocks} 个 shadcn Blocks，涵盖登录、侧栏和仪表盘。`,
      icon: FileText,
      href: href({ view: "blocks", template: "sidebar-07" }),
    },
  ];

  return (
    <main className="mx-auto min-w-0 max-w-7xl px-4 sm:px-8 lg:px-12">
      <section
        aria-labelledby="home-title"
        className="grid items-center gap-8 py-8 sm:py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:py-18"
      >
        <div className="min-w-0">
          <h1
            id="home-title"
            className="grid gap-1 text-[clamp(2.5rem,5.2vw,4.375rem)] leading-[1.1] font-semibold tracking-tight"
          >
            <span>先看风格，</span>
            <span>再做界面。</span>
          </h1>
          <p className="mt-5 max-w-[30rem] text-base leading-relaxed text-muted-foreground sm:text-lg">
            在同一套 shadcn/ui
            组件和完整应用案例上切换风格。亲手试过按钮、表单和导航，再选定你的界面方向。
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button asChild size="lg">
              <a href={href({ view: "showcase" })}>
                浏览组件总览 <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={href({ view: "scene", scene: "workspace" })}>
                探索应用案例
              </a>
            </Button>
          </div>
          <dl className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
            {[
              { amount: counts.components, label: "个组件" },
              { amount: themes.length, label: "套风格" },
              { amount: counts.scenes, label: "个应用案例" },
            ].map(({ amount, label }) => (
              <div key={label} className="flex items-baseline gap-1">
                <dt className="order-2">{label}</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {amount}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ThemePreview theme={theme} onTheme={onTheme} />
      </section>

      <section aria-labelledby="home-styles" className="border-t py-8 sm:py-11">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="home-styles"
              className="text-2xl font-semibold tracking-tight"
            >
              选择你的界面风格
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              选一套风格，查看它在所有组件上的完整效果。
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <a href={href({ view: "themes" })}>
              查看主题目录 <ArrowRight />
            </a>
          </Button>
        </div>
        <div className="grid gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {themes.map((entry) => (
            <a
              key={entry.id}
              href={href({ view: "showcase", theme: entry.id })}
              className="group block min-w-0 overflow-hidden rounded-xl border bg-background transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div
                data-atlas-theme={entry.id}
                aria-hidden="true"
                className="grid h-20 place-items-center border-b bg-muted px-4"
              >
                <div className="flex w-full max-w-44 items-center gap-2 rounded-(--atlas-surface-radius) border bg-card p-2 shadow-(--atlas-surface-shadow)">
                  <span className="flex h-6 grow items-center rounded-(--atlas-control-radius) border border-input px-2 text-[10px] text-muted-foreground">
                    文本输入
                  </span>
                  <span className="grid h-6 shrink-0 place-items-center rounded-(--atlas-control-radius) bg-primary px-2 text-[10px] text-primary-foreground shadow-(--atlas-control-shadow)">
                    确认
                  </span>
                </div>
              </div>
              <div className="px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{entry.label}</h3>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-muted-foreground group-hover:text-foreground"
                  />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {entry.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="home-cases" className="border-t py-8 sm:py-11">
        <h2
          id="home-cases"
          className="mb-5 text-2xl font-semibold tracking-tight"
        >
          在完整页面里看效果
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {destinations.map(({ title, description, icon: Icon, href }) => (
            <a
              key={title}
              href={href}
              className="group grid content-start gap-2 rounded-xl border bg-card p-4 transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground group-hover:text-foreground"
                />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
