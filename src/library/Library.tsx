import { useEffect, useState, useSyncExternalStore } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Box,
  Code2,
  Layers,
  LayoutTemplate,
  Search,
} from "lucide-react";
import { route } from "./route";
import { CopyButton } from "../components/Clipboard";
import ButtonDemo from "./examples/button-demo";
import InputDemo from "./examples/input-demo";
import SwitchDemo from "./examples/switch-demo";
import CardDemo from "./examples/card-demo";
import BadgeDemo from "./examples/badge-demo";
import DialogDemo from "./examples/dialog-demo";
import { Dashboard, Settings } from "./Templates";
import "./theme.css";
import "./library.css";

const components = [
  {
    id: "button",
    name: "按钮",
    group: "基础控件",
    description: "触发操作，区分主要、辅助与危险动作。",
    usage: "<Button onClick={handleSave}>保存修改</Button>",
  },
  {
    id: "input",
    name: "输入框",
    group: "基础控件",
    description: "输入单行文本，支持原生字段类型与表单校验。",
    usage:
      '<Input aria-label="邮箱地址" type="email" placeholder="you@example.com" />',
  },
  {
    id: "switch",
    name: "开关",
    group: "基础控件",
    description: "立即切换一项设置，支持键盘操作与受控状态。",
    usage:
      '<Switch aria-label="启用通知" checked={enabled} onCheckedChange={setEnabled} />',
  },
  {
    id: "card",
    name: "卡片",
    group: "信息展示",
    description: "组合标题、内容和操作，建立清晰的信息分区。",
    usage:
      "<Card>\n  <CardHeader><CardTitle>项目概览</CardTitle></CardHeader>\n  <CardContent>项目内容</CardContent>\n</Card>",
  },
  {
    id: "badge",
    name: "标签",
    group: "信息展示",
    description: "简洁标记类别、状态或优先级。",
    usage: '<Badge variant="secondary">进行中</Badge>',
  },
  {
    id: "dialog",
    name: "对话框",
    group: "弹层",
    description: "聚焦当前操作，支持 Escape 退出并归还焦点。",
    usage:
      "<Dialog>\n  <DialogTrigger asChild><Button>打开</Button></DialogTrigger>\n  <DialogContent>\n    <DialogTitle>项目设置</DialogTitle>\n    <DialogDescription>更新项目名称与说明。</DialogDescription>\n  </DialogContent>\n</Dialog>",
  },
] as const;
const themes = [
  {
    id: "shadcn",
    name: "shadcn 默认",
    description: "使用 shadcn/ui 文档的默认中性色与圆角。",
  },
  {
    id: "blueprint",
    name: "蓝图",
    description: "冷白界面、清晰边框与紧凑节奏。适合控制台和高频工作区。",
  },
  {
    id: "paper",
    name: "暖纸",
    description: "暖色纸面、衬线字阶与舒展空间。适合阅读、创作和团队协作。",
  },
];
const templates = [
  {
    id: "dashboard",
    name: "项目看板",
    description: "任务概览、项目状态与新建流程。",
    Page: Dashboard,
  },
  {
    id: "settings",
    name: "工作区设置",
    description: "分组表单、受控开关与提交反馈。",
    Page: Settings,
  },
];
const files = import.meta.glob(
  [
    "./ui/*.tsx",
    "./examples/*.tsx",
    "./ui/cn.ts",
    "./ui/LICENSE.md",
    "./theme.css",
    "./Templates.tsx",
    "./templates.css",
  ],
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>;
const deps =
  "npm install radix-ui class-variance-authority clsx tailwind-merge lucide-react\nnpm install -D tailwindcss @tailwindcss/vite tw-animate-css";

function SourceFiles({ paths, use }: { paths: string[]; use: string }) {
  const [file, setFile] = useState(paths[0]);
  const content = files[file];
  return (
    <section className="lib-source">
      <h2>源码与使用</h2>
      <p>
        在 React 项目安装依赖，启用 Tailwind CSS v4。按下方路径保存文件并导入
        theme.css，在根节点设置 <code>data-atlas-theme</code> 为{" "}
        <code>shadcn</code>、<code>blueprint</code> 或 <code>paper</code>。
      </p>
      <pre>{deps}</pre>
      {use && <pre>{use}</pre>}
      <div className="lib-file-tools">
        <select
          aria-label="选择源码文件"
          value={file}
          onChange={(e) => setFile(e.target.value)}
        >
          {paths.map((path) => (
            <option value={path} key={path}>
              {path.slice(2)}
            </option>
          ))}
        </select>
        <CopyButton text={content} label="复制源码" />
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(content)}`}
          download={file.split("/").at(-1)}
          aria-label="下载当前文件"
        >
          <ArrowDownToLine size={17} />
        </a>
      </div>
      <pre className="lib-code">{content}</pre>
    </section>
  );
}

const demos = {
  button: ButtonDemo,
  input: InputDemo,
  switch: SwitchDemo,
  card: CardDemo,
  badge: BadgeDemo,
  dialog: DialogDemo,
};
const demoDependencies: Partial<Record<keyof typeof demos, string[]>> = {
  switch: ["label"],
  card: ["button", "input", "label"],
  dialog: ["button", "input", "label"],
};

export function Library() {
  useSyncExternalStore(route.subscribe, route.snapshot);

  const area = route.get("view", "components");
  const theme = themes.find((t) => t.id === route.get("theme"))?.id ?? "shadcn";
  const picked =
    components.find((c) => c.id === route.get("component")) ?? components[0];
  const Demo = demos[picked.id];
  const template =
    templates.find((t) => t.id === route.get("template")) ?? templates[0];
  const [query, setQuery] = useState("");
  const codeOpen = route.get("tab") === "code";
  useEffect(() => {
    document.documentElement.dataset.atlasTheme = theme;
    return () => {
      delete document.documentElement.dataset.atlasTheme;
    };
  }, [theme]);
  const choose = (values: Record<string, string>) =>
    route.link({ view: area, theme, tab: "", ...values });
  const componentPaths = [
    `./ui/${picked.id}.tsx`,
    `./examples/${picked.id}-demo.tsx`,
    ...(demoDependencies[picked.id] ?? []).map((id) => `./ui/${id}.tsx`),
    "./ui/cn.ts",
    "./theme.css",
    "./ui/LICENSE.md",
  ];
  const templatePaths = [
    "./Templates.tsx",
    "./templates.css",
    "./theme.css",
    ...components.map((c) => `./ui/${c.id}.tsx`),
    "./ui/cn.ts",
    "./ui/LICENSE.md",
  ];
  if (area === "full")
    return (
      <main className="atlas-kit kit-full">
        <template.Page />
      </main>
    );
  return (
    <div className="library">
      <header className="lib-top">
        <a
          className="lib-brand"
          href={choose({ view: "components", component: "button" })}
        >
          <span>
            <Layers size={19} />
          </span>
          UI Atlas
        </a>
        <nav aria-label="主导航">
          {[
            ["components", "组件"],
            ["styles", "风格体系"],
            ["templates", "页面模板"],
          ].map(([id, name]) => (
            <a
              key={id}
              aria-current={area === id ? "page" : undefined}
              href={choose({ view: id })}
            >
              {name}
            </a>
          ))}
        </nav>
        <label className="lib-theme">
          <span>当前风格</span>
          <select
            aria-label="当前风格"
            value={theme}
            onChange={(e) => route.patch({ theme: e.target.value })}
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </header>
      <div className="lib-layout">
        <aside className="lib-sidebar">
          <div className="lib-guide">
            <Box size={15} /> 组件文档
          </div>
          <label className="lib-search">
            <Search size={15} />
            <input
              aria-label="搜索组件"
              placeholder="搜索组件…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (area !== "components")
                  route.patch({ view: "components", tab: null });
              }}
            />
          </label>
          {["基础控件", "信息展示", "弹层"].map((group) => {
            const matches = components.filter(
              (c) =>
                c.group === group &&
                `${c.name} ${c.id}`.includes(query.trim().toLowerCase()),
            );
            return (
              matches.length > 0 && (
                <div className="lib-group" key={group}>
                  <h2>{group}</h2>
                  {matches.map((c) => (
                    <a
                      key={c.id}
                      aria-current={
                        area === "components" && c.id === picked.id
                          ? "page"
                          : undefined
                      }
                      href={choose({ view: "components", component: c.id })}
                    >
                      {c.name}
                      <small>{c.id}</small>
                    </a>
                  ))}
                </div>
              )
            );
          })}
          {query &&
            !components.some((c) =>
              `${c.name} ${c.id}`.includes(query.trim().toLowerCase()),
            ) && <p className="lib-muted">没有匹配的组件</p>}
          <div className="lib-group">
            <h2>页面模板</h2>
            {templates.map((t) => (
              <a
                key={t.id}
                aria-current={
                  area === "templates" && t.id === template.id
                    ? "page"
                    : undefined
                }
                href={choose({ view: "templates", template: t.id })}
              >
                {t.name}
                <LayoutTemplate size={14} />
              </a>
            ))}
          </div>
        </aside>
        <main className="lib-main">
          {area === "styles" ? (
            <>
              <div className="lib-heading">
                <h1>风格体系</h1>
                <p>同一套 shadcn 组件。选择风格后，组件与页面模板同步切换。</p>
              </div>
              <div className="lib-styles">
                {themes.map((t) => (
                  <article className="lib-style-card" key={t.id}>
                    <div
                      className="atlas-kit lib-style-preview"
                      data-atlas-theme={t.id}
                    >
                      <ButtonDemo />
                      <BadgeDemo />
                    </div>
                    <div className="lib-style-meta">
                      <h2>{t.name}</h2>
                      <p>{t.description}</p>
                      <a href={choose({ theme: t.id, view: "components" })}>
                        浏览这套组件 <ArrowUpRight size={15} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="lib-heading">
                <div className="lib-crumb">
                  {area === "templates" ? "页面模板" : picked.group}
                </div>
                <h1>
                  {area === "templates" ? template.name : picked.name}
                  {area !== "templates" && <small> {picked.id}</small>}
                </h1>
                <p>
                  {area === "templates"
                    ? template.description
                    : picked.description}
                </p>
              </div>
              <div className="lib-tabs">
                <a
                  aria-current={!codeOpen ? "page" : undefined}
                  href={choose({})}
                >
                  预览
                </a>
                <a
                  aria-current={codeOpen ? "page" : undefined}
                  href={choose({ tab: "code" })}
                >
                  <Code2 size={16} /> 源码
                </a>
                {area === "templates" && (
                  <a
                    className="lib-full-link"
                    href={choose({ view: "full", template: template.id })}
                    target="_blank"
                    rel="noreferrer"
                  >
                    打开完整页面 <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
              {codeOpen ? (
                <SourceFiles
                  key={area === "templates" ? template.id : picked.id}
                  paths={area === "templates" ? templatePaths : componentPaths}
                  use={
                    area === "templates"
                      ? `import { ${template.id === "dashboard" ? "Dashboard" : "Settings"} } from "./Templates";\nimport "./theme.css";`
                      : picked.usage
                  }
                />
              ) : (
                <>
                  <div
                    data-slot={
                      area === "templates" ? undefined : "component-preview"
                    }
                    className={`atlas-kit ${area === "templates" ? "kit-template" : "group relative flex flex-col overflow-hidden rounded-2xl border bg-background"}`}
                  >
                    {area === "templates" ? (
                      <template.Page key={template.id} />
                    ) : (
                      <div
                        data-slot="preview"
                        data-align="center"
                        className="preview relative flex min-h-72 w-full justify-center p-6 data-[align=center]:items-center sm:p-10"
                        key={picked.id}
                        onSubmit={(event) => event.preventDefault()}
                        onClick={(event) => {
                          if (
                            event.target instanceof Element &&
                            event.target.closest('a[href="#"]')
                          )
                            event.preventDefault();
                        }}
                      >
                        <Demo />
                      </div>
                    )}
                  </div>
                  {area !== "templates" && (
                    <section className="lib-use">
                      <h2>示例源码</h2>
                      <pre>{files[`./examples/${picked.id}-demo.tsx`]}</pre>
                    </section>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
