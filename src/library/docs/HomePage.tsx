import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  LayoutDashboard,
  PanelsTopLeft,
} from "lucide-react";
import { themes, type AtlasTheme } from "../themes";
import { Button } from "../ui/button";
import { HomeStyleArtwork } from "./HomeStyleArtwork";
import { HomeThemeSwitcher } from "./HomeThemeSwitcher";

type HomePageProps = {
  theme: AtlasTheme;
  onTheme: (theme: AtlasTheme["id"]) => void;
  href: (values: Record<string, string>) => string;
  counts: { components: number; scenes: number; blocks: number };
};

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
        className="grid items-center gap-7 py-8 sm:py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-y-9 lg:gap-x-16 lg:pt-14 lg:pb-11"
      >
        <div
          data-home-intro=""
          className="min-w-0 md:col-start-1 md:row-start-1"
        >
          <h1
            id="home-title"
            className="text-[clamp(1.75rem,3.1vw,2.625rem)] leading-[1.2] font-semibold tracking-tight"
          >
            <span className="inline-block">先看风格，</span>
            <span className="inline-block">再做界面。</span>
          </h1>
          <p className="mt-4 max-w-[27rem] text-base leading-relaxed text-muted-foreground">
            在同一套 shadcn/ui
            组件和完整应用案例上切换风格。亲手试过按钮、表单和导航，再选定你的界面方向。
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button asChild>
              <a href={href({ view: "showcase" })}>
                浏览组件总览 <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={href({ view: "scene", scene: "workspace" })}>
                探索应用案例
              </a>
            </Button>
          </div>
          <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
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
        <HomeThemeSwitcher theme={theme} onTheme={onTheme} />
        <HomeStyleArtwork theme={theme} />
      </section>

      <section aria-labelledby="home-cases" className="pb-8 sm:pb-11">
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
