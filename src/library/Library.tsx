import { lazy, Suspense, useEffect, useSyncExternalStore } from "react";
import { ThemeProvider } from "next-themes";
import { route } from "./route";
import registry from "./registry.json";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner";
import { SiteHeader } from "./docs/SiteHeader";
import DocsLayout from "./docs/DocsLayout";
import { DocPage } from "./docs/DocPage";
import { BlockViewer } from "./docs/BlockViewer";
import { ComponentPreview } from "./docs/ComponentPreview";
import { Showcase } from "./docs/Showcase";
import "./theme.css";
import "./docs/styles.css";
import "./themes.css";
import { themes } from "./themes";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const views = [
  { id: "components", label: "组件" },
  { id: "showcase", label: "组件总览" },
  { id: "blocks", label: "页面模板" },
  { id: "themes", label: "主题" },
];
const blockLabels: Record<string, { label: string; description: string }> = {
  "login-01": { label: "登录页", description: "包含表单与登录操作的页面。" },
  "sidebar-07": {
    label: "可折叠侧栏",
    description: "侧栏可以收起为图标，保留主要导航。",
  },
  "dashboard-01": {
    label: "仪表盘",
    description: "包含侧栏、指标卡片、图表和数据表格的工作台。",
  },
};
const exampleModules = import.meta.glob<{ default: React.ComponentType }>(
  "./examples/*-demo.tsx",
);
const blockModules = import.meta.glob<{ default: React.ComponentType }>(
  "./blocks/*/page.tsx",
);
const examples = Object.fromEntries(
  registry.components.map((item) => [
    item.id,
    lazy(exampleModules[`./examples/${item.id}-demo.tsx`]),
  ]),
);
const blocks = Object.fromEntries(
  registry.blocks.map((item) => [
    item.id,
    lazy(blockModules[`./blocks/${item.id}/page.tsx`]),
  ]),
);

export function Library() {
  useSyncExternalStore(route.subscribe, route.snapshot);
  const currentView = route.get("view", "components");
  const view =
    currentView === "templates"
      ? "blocks"
      : currentView === "styles"
        ? "themes"
        : currentView;
  const requestedBlock = route.get("template");
  const currentBlock =
    requestedBlock === "dashboard"
      ? "dashboard-01"
      : requestedBlock === "settings"
        ? "sidebar-07"
        : requestedBlock;
  const block =
    registry.blocks.find((item) => item.id === currentBlock) ??
    registry.blocks[0];
  const item =
    registry.components.find((entry) => entry.id === route.get("component")) ??
    registry.components[0];
  const selectedTheme =
    themes.find((entry) => entry.id === route.get("theme")) ?? themes[0];
  const theme = selectedTheme.id;
  const Block = blocks[block.id];
  const Example = examples[item.id];
  const choose = (values: Record<string, string>) =>
    route.link({ view, theme, ...values });
  const blockView = view === "blocks";
  const viewKey = `${view}:${blockView ? block.id : item.id}`;
  useEffect(() => {
    document.documentElement.dataset.atlasTheme = theme;
    return () => {
      delete document.documentElement.dataset.atlasTheme;
    };
  }, [theme]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewKey]);
  const navItems = views.map((entry) => ({
    ...entry,
    href: choose({ view: entry.id }),
  }));
  const componentGroups = Array.from(
    new Set(registry.components.map((entry) => entry.group)),
  ).map((group) => ({
    name: group,
    pages: registry.components
      .filter((entry) => entry.group === group)
      .map((entry) => ({
        id: entry.id,
        name: entry.title,
        keywords: [entry.zh.title],
        href: choose({ view: "components", component: entry.id }),
        active: view === "components" && item.id === entry.id,
      })),
  }));
  const blockGroup = {
    name: "页面模板",
    pages: registry.blocks.map((entry) => ({
      id: entry.id,
      name: blockLabels[entry.id].label,
      href: choose({ view: "blocks", template: entry.id }),
      active: blockView && block.id === entry.id,
    })),
  };
  const groups = [
    ...componentGroups,
    blockGroup,
    {
      name: "主题",
      pages: [
        {
          id: "themes",
          name: "主题预设",
          href: choose({ view: "themes" }),
          active: view === "themes",
        },
        {
          id: "showcase",
          name: "组件总览",
          href: choose({ view: "showcase" }),
          active: view === "showcase",
        },
      ],
    },
  ];
  if (view === "full")
    return (
      <ThemeProvider forcedTheme="light" attribute="class" enableSystem={false}>
        <main
          data-slot="block-preview"
          onSubmit={(event) => event.preventDefault()}
          onClick={(event) => {
            if (
              event.target instanceof Element &&
              event.target.closest('a[href="#"]')
            )
              event.preventDefault();
          }}
        >
          <Suspense fallback={<p className="p-6">正在加载页面模板…</p>}>
            <Block key={block.id} />
          </Suspense>
        </main>
      </ThemeProvider>
    );

  const listing = componentGroups.flatMap((group) => group.pages);
  const index = listing.findIndex((entry) => entry.id === item.id);
  return (
    <ThemeProvider forcedTheme="light" attribute="class" enableSystem={false}>
      <Toaster />
      <SiteHeader
        items={navItems}
        groups={groups}
        theme={selectedTheme}
        themesHref={choose({ view: "themes" })}
        onTheme={(value) => route.patch({ theme: value })}
      />
      {blockView ? (
        <BlockViewer
          key={block.id}
          title={blockLabels[block.id].label}
          description={blockLabels[block.id].description}
          id={block.id}
          href={choose({ view: "full", template: block.id })}
          links={blockGroup.pages}
        />
      ) : view === "showcase" ? (
        <Showcase
          theme={selectedTheme.label}
          groups={componentGroups.map((group, index) => ({
            id: `showcase-group-${index}`,
            name: group.name,
            entries: group.pages.map((page) => {
              const Demo = examples[page.id];
              return {
                ...page,
                preview: (
                  <Suspense
                    fallback={
                      <p className="text-sm text-muted-foreground">正在加载…</p>
                    }
                  >
                    <Demo />
                  </Suspense>
                ),
              };
            }),
          }))}
        />
      ) : (
        <DocsLayout groups={groups}>
          {view === "themes" ? (
            <DocPage
              title="主题"
              description="为同一套 shadcn 组件切换不同视觉风格。"
              sections={[]}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {themes.map((entry) => (
                  <section
                    key={entry.id}
                    data-atlas-theme={entry.id}
                    className="style-specimen min-w-0 border bg-background p-4 text-foreground"
                  >
                    <h2 className="text-base font-semibold">{entry.label}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {entry.description}
                    </p>
                    <Card className="mt-3 py-3">
                      <CardContent className="flex flex-wrap items-center gap-2 px-3">
                        <Button asChild size="sm">
                          <a
                            href={choose({ view: "showcase", theme: entry.id })}
                          >
                            查看组件总览
                          </a>
                        </Button>
                        <Badge variant="secondary">预览</Badge>
                      </CardContent>
                    </Card>
                  </section>
                ))}
              </div>
            </DocPage>
          ) : (
            <DocPage
              title={item.title}
              description={item.zh.description}
              previous={listing[index - 1]}
              next={listing[index + 1]}
              sections={[{ id: "preview", label: "预览" }]}
            >
              <section id="preview" className="scroll-mt-20">
                <ComponentPreview
                  key={item.id}
                  className="min-h-72 rounded-2xl border bg-card p-6 sm:p-10"
                >
                  <Suspense fallback={<p>正在加载预览…</p>}>
                    <Example />
                  </Suspense>
                </ComponentPreview>
              </section>
            </DocPage>
          )}
        </DocsLayout>
      )}
    </ThemeProvider>
  );
}
