import {
  lazy,
  Suspense,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { ArrowDownToLine } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { route } from "./route";
import registry from "./registry.json";
import { Button } from "./ui/button";
import { SiteHeader } from "./docs/SiteHeader";
import DocsLayout from "./docs/DocsLayout";
import { DocPage } from "./docs/DocPage";
import { BlockViewer } from "./docs/BlockViewer";
import { ComponentPreviewTabs } from "./docs/ComponentPreviewTabs";
import { ComponentSource } from "./docs/ComponentSource";
import "./theme.css";
import "./docs/styles.css";

const themes = [
  { id: "shadcn", label: "shadcn Default" },
  { id: "blueprint", label: "Blueprint" },
  { id: "paper", label: "Warm Paper" },
];
const views = [
  { id: "components", label: "Components" },
  { id: "blocks", label: "Blocks" },
  { id: "themes", label: "Themes" },
];
const blockLabels: Record<string, { label: string; description: string }> = {
  "login-01": { label: "Login", description: "A simple login form." },
  "sidebar-07": {
    label: "Collapsible Sidebar",
    description: "A sidebar that collapses to icons.",
  },
  "dashboard-01": {
    label: "Dashboard",
    description: "A dashboard with sidebar, charts and data table.",
  },
};
const files = import.meta.glob<string>(
  [
    "./ui/*.{tsx,ts,md}",
    "./examples/*.tsx",
    "./blocks/**/*.{tsx,json}",
    "./hooks/*.ts",
    "./theme.css",
  ],
  { query: "?raw", import: "default" },
);
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

function useSourceFile(file: string) {
  const [result, setResult] = useState<{
    file: string;
    content?: string;
    failed?: boolean;
  }>();
  useEffect(() => {
    let current = true;
    files[`./${file}`]()
      .then((content) => {
        if (current) setResult({ file, content });
      })
      .catch(() => {
        if (current) setResult({ file, failed: true });
      });
    return () => {
      current = false;
    };
  }, [file]);
  return result?.file === file ? result : undefined;
}

function PreviewSource({
  file,
  maxLines,
}: {
  file: string;
  maxLines?: number;
}) {
  const result = useSourceFile(file);
  if (result?.failed)
    return <p className="p-4 text-sm">The source file could not load.</p>;
  if (!result) return <p className="p-4 text-sm">Loading source…</p>;
  return (
    <ComponentSource
      code={result.content!}
      title={maxLines ? undefined : file.split("/").at(-1)}
      maxLines={maxLines}
    />
  );
}

function SourceFiles({ paths }: { paths: string[] }) {
  const [file, setFile] = useState(paths[0]);
  const result = useSourceFile(file);
  const content = result?.content;
  return (
    <div className="mt-4 min-w-0 rounded-xl border">
      <div className="flex items-center gap-2 border-b p-2">
        <select
          aria-label="Source file"
          value={file}
          onChange={(event) => setFile(event.target.value)}
          className="min-w-0 flex-1 rounded-md border bg-background p-2 text-sm"
        >
          {paths.map((path) => (
            <option key={path} value={path}>
              {path}
            </option>
          ))}
        </select>
        {content !== undefined && (
          <Button asChild variant="ghost" size="icon-sm">
            <a
              aria-label="Download source"
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(content)}`}
              download={file.split("/").at(-1)}
            >
              <ArrowDownToLine />
            </a>
          </Button>
        )}
      </div>
      {content !== undefined ? (
        <ComponentSource
          key={file}
          code={content}
          title={file.split("/").at(-1)}
        />
      ) : (
        <p className="p-4 text-sm">
          {result?.failed
            ? "The source file could not load."
            : "Loading source…"}
        </p>
      )}
    </div>
  );
}

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
  const theme =
    themes.find((entry) => entry.id === route.get("theme"))?.id ?? "shadcn";
  const Block = blocks[block.id];
  const Example = examples[item.id];
  const choose = (values: Record<string, string>) =>
    route.link({ view, theme, tab: "", ...values });
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
  const groups = [
    ...Array.from(new Set(registry.components.map((entry) => entry.group))).map(
      (group) => ({
        name: group,
        pages: registry.components
          .filter((entry) => entry.group === group)
          .map((entry) => ({
            id: entry.id,
            name: entry.title,
            href: choose({ view: "components", component: entry.id }),
            active: view === "components" && item.id === entry.id,
          })),
      }),
    ),
    {
      name: "Blocks",
      pages: registry.blocks.map((entry) => ({
        id: entry.id,
        name: blockLabels[entry.id].label,
        href: choose({ view: "blocks", template: entry.id }),
        active: blockView && block.id === entry.id,
      })),
    },
    {
      name: "Themes",
      pages: [
        {
          id: "themes",
          name: "Theme presets",
          href: choose({ view: "themes" }),
          active: view === "themes",
        },
      ],
    },
  ];
  if (view === "full")
    return (
      <ThemeProvider forcedTheme="light" enableSystem={false}>
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
          <Suspense fallback={<p className="p-6">Loading block…</p>}>
            <Block key={block.id} />
          </Suspense>
        </main>
      </ThemeProvider>
    );

  const listing = groups.slice(0, -2).flatMap((group) => group.pages);
  const index = listing.findIndex((entry) => entry.id === item.id);
  return (
    <ThemeProvider forcedTheme="light" enableSystem={false}>
      <SiteHeader
        items={navItems}
        groups={groups}
        themes={themes}
        theme={theme}
        onTheme={(value) => route.patch({ theme: value })}
      />
      {blockView ? (
        <BlockViewer
          key={block.id}
          title={blockLabels[block.id].label}
          description={blockLabels[block.id].description}
          id={block.id}
          href={choose({ view: "full", template: block.id })}
          links={groups.find((group) => group.name === "Blocks")!.pages}
          source={
            <SourceFiles
              key={block.id}
              paths={[...block.files, "theme.css", "ui/LICENSE.md"]}
            />
          }
        />
      ) : (
        <DocsLayout groups={groups}>
          {view === "themes" ? (
            <DocPage
              title="Themes"
              description="Use the same shadcn components across different visual systems."
              sections={[]}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {themes.map((entry) => (
                  <div
                    key={entry.id}
                    data-atlas-theme={entry.id}
                    className="rounded-xl border bg-background p-4 text-foreground"
                  >
                    <h2 className="mb-4 text-sm font-semibold">
                      {entry.label}
                    </h2>
                    <Button
                      asChild
                      variant={theme === entry.id ? "default" : "outline"}
                    >
                      <a href={choose({ theme: entry.id })}>
                        {theme === entry.id ? "Selected" : "Select theme"}
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </DocPage>
          ) : (
            <DocPage
              title={item.title}
              description={item.description}
              previous={listing[index - 1]}
              next={listing[index + 1]}
              sections={[
                { id: "preview", label: "Preview" },
                { id: "source", label: "Source files" },
              ]}
            >
              <section id="preview" className="scroll-mt-20">
                <ComponentPreviewTabs
                  key={item.id}
                  component={
                    <Suspense fallback={<p>Loading preview…</p>}>
                      <Example />
                    </Suspense>
                  }
                  source={<PreviewSource file={item.files[0]} />}
                  sourcePreview={
                    <PreviewSource file={item.files[0]} maxLines={3} />
                  }
                />
              </section>
              <section id="source" className="mt-8 scroll-mt-20">
                <h2 className="text-xl font-semibold tracking-tight">
                  Source files
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Copy the implementation and dependencies into your project.
                </p>
                <SourceFiles
                  key={viewKey}
                  paths={[...item.files, "theme.css", "ui/LICENSE.md"]}
                />
              </section>
            </DocPage>
          )}
        </DocsLayout>
      )}
    </ThemeProvider>
  );
}
