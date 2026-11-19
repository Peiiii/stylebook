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
import { scenes } from "./scenes";
import { SceneViewer } from "./docs/SceneViewer";
import { HomePage } from "./docs/HomePage";
import "./theme.css";
import "./docs/styles.css";
import "./themes.css";
import { themes } from "./themes";
import { componentReference, themeReference } from "./references";
import { ReferenceActions } from "./docs/ReferenceActions";
import { Card, CardContent } from "./ui/card";

const views = [
  { id: "home", label: "首页" },
  { id: "showcase", label: "组件总览" },
  { id: "scene", label: "场景总览" },
  { id: "blocks", label: "页面模板" },
  { id: "components", label: "组件" },
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

function PreviewPending() {
  return (
    <span className="sr-only" role="status">
      正在加载预览
    </span>
  );
}
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
  const currentView = route.get(
    "view",
    route.get("component") ? "components" : "home",
  );
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
    themes.find(
      (entry) =>
        entry.id ===
        (route.get("theme") === "glass" ? "ios" : route.get("theme")),
    ) ?? themes[0];
  const theme = selectedTheme.id;
  const scene =
    scenes.find((entry) => entry.id === route.get("scene")) ?? scenes[0];
  const ScenePreview = scene.Preview;
  const Block = blocks[block.id];
  const Example = examples[item.id];
  const choose = (values: Record<string, string>) =>
    route.link({ view, theme, ...values });
  const changeTheme = (value: string) => route.patch({ theme: value });
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
        reference: componentReference(entry, selectedTheme),
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
        {
          id: "scene",
          name: "场景总览",
          href: choose({ view: "scene" }),
          active: view === "scene",
        },
      ],
    },
  ];
  if (view === "scene-full")
    return (
      <ThemeProvider forcedTheme="light" attribute="class" enableSystem={false}>
        <Toaster />
        <Suspense fallback={<PreviewPending />}>
          <ScenePreview key={scene.id} />
        </Suspense>
      </ThemeProvider>
    );

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
          <Suspense fallback={<PreviewPending />}>
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
        activeView={view}
        groups={groups}
        theme={selectedTheme}
        themesHref={choose({ view: "themes" })}
        onTheme={changeTheme}
      />
      {view === "home" ? (
        <HomePage
          theme={selectedTheme}
          onTheme={changeTheme}
          href={choose}
          counts={{
            components: registry.components.length,
            scenes: scenes.length,
            blocks: registry.blocks.length,
          }}
        />
      ) : blockView ? (
        <BlockViewer
          key={block.id}
          title={blockLabels[block.id].label}
          description={blockLabels[block.id].description}
          id={block.id}
          href={choose({ view: "full", template: block.id })}
          links={blockGroup.pages}
        />
      ) : view === "scene" ? (
        <SceneViewer
          title={scene.label}
          cases={scenes.map((entry) => ({
            label: entry.label,
            href: choose({ view: "scene", scene: entry.id }),
            active: entry.id === scene.id,
          }))}
          href={route.link({
            view: "scene-full",
            scene: scene.id,
            theme,
            template: null,
            component: null,
          })}
        />
      ) : view === "showcase" ? (
        <Showcase
          theme={selectedTheme.label}
          themeCitation={themeReference(selectedTheme)}
          groups={componentGroups.map((group, index) => ({
            id: `showcase-group-${index}`,
            name: group.name,
            entries: group.pages.map((page) => {
              const Demo = examples[page.id];
              return {
                ...page,
                preview: (
                  <Suspense fallback={<PreviewPending />}>
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
                    className="style-specimen reference-surface min-w-0 border bg-background p-4 text-foreground"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-base font-semibold">{entry.label}</h2>
                      <ReferenceActions
                        reference={themeReference(entry)}
                        showSource
                        className="reference-reveal"
                      />
                    </div>
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
                        <Button asChild size="sm" variant="outline">
                          <a href={choose({ view: "scene", theme: entry.id })}>
                            查看场景总览
                          </a>
                        </Button>
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
              actions={
                <ReferenceActions
                  reference={componentReference(item, selectedTheme)}
                  showSource
                />
              }
              previous={listing[index - 1]}
              next={listing[index + 1]}
              sections={[{ id: "preview", label: "预览" }]}
            >
              <section id="preview" className="scroll-mt-20">
                <ComponentPreview
                  key={item.id}
                  className="min-h-72 rounded-2xl border bg-card p-6 sm:p-10"
                >
                  <Suspense fallback={<PreviewPending />}>
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
