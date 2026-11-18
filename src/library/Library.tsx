import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Box,
  Code2,
  Layers,
  LayoutTemplate,
  Search,
} from "lucide-react";
import { catalog } from "../catalog/store";
import { CopyButton } from "../components/Clipboard";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
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
];
const themes = [
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
        theme.css，在根节点设置 <code>data-atlas-theme="blueprint"</code> 或{" "}
        <code>"paper"</code>。
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

function Specimen({ id }: { id: string }) {
  const [on, setOn] = useState(true);
  const [pressed, setPressed] = useState(false);
  if (id === "button")
    return (
      <div className="specimen-stack">
        <div className="specimen-buttons">
          <Button onClick={() => setPressed(true)}>保存修改</Button>
          <Button variant="outline" onClick={() => setPressed(false)}>
            还原
          </Button>
          <Button disabled>不可用</Button>
        </div>
        <p role="status">{pressed ? "修改已保存" : "点击主要按钮查看反馈"}</p>
      </div>
    );
  if (id === "input")
    return (
      <label className="kit-label specimen-input">
        邮箱地址
        <Input type="email" placeholder="you@example.com" />
      </label>
    );
  if (id === "switch")
    return (
      <div className="kit-setting specimen-input">
        <label htmlFor="preview-switch">
          项目通知<small>{on ? "已开启通知" : "已暂停通知"}</small>
        </label>
        <Switch id="preview-switch" checked={on} onCheckedChange={setOn} />
      </div>
    );
  if (id === "badge")
    return (
      <div className="specimen-buttons">
        <Badge>已完成</Badge>
        <Badge variant="secondary">进行中</Badge>
        <Badge variant="outline">待确认</Badge>
      </div>
    );
  if (id === "card")
    return (
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle>产品文档</CardTitle>
          <CardDescription>发布前复核内容与链接。</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">进行中</Badge>
        </CardContent>
        <CardFooter>下一次复核 · 周五</CardFooter>
      </Card>
    );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>打开对话框</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>项目设置</DialogTitle>
        <DialogDescription>更新项目名称与说明。</DialogDescription>
        <label className="kit-label">
          项目名称
          <Input defaultValue="Studio North" />
        </label>
        <DialogClose asChild>
          <Button variant="outline">关闭</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export function Library() {
  const area = catalog.get("view", "components");
  const theme = catalog.get("theme") === "paper" ? "paper" : "blueprint";
  const picked =
    components.find((c) => c.id === catalog.get("component")) ?? components[0];
  const template =
    templates.find((t) => t.id === catalog.get("template")) ?? templates[0];
  const [query, setQuery] = useState("");
  const codeOpen = catalog.get("tab") === "code";
  useEffect(() => {
    document.documentElement.dataset.atlasTheme = theme;
    return () => {
      delete document.documentElement.dataset.atlasTheme;
    };
  }, [theme]);
  const choose = (values: Record<string, string>) =>
    catalog.link({ view: area, theme, tab: "", ...values });
  const componentPaths = [
    `./ui/${picked.id}.tsx`,
    ...(picked.id === "dialog" ? ["./ui/button.tsx"] : []),
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
            onChange={(e) => catalog.patch({ theme: e.target.value })}
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
                  catalog.patch({ view: "components", tab: null });
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
                <p>
                  同一套组件
                  API，两套视觉体系。选择风格后，组件与页面模板同步切换。
                </p>
              </div>
              <div className="lib-styles">
                {themes.map((t) => (
                  <article className="lib-style-card" key={t.id}>
                    <div
                      className="atlas-kit lib-style-preview"
                      data-atlas-theme={t.id}
                    >
                      <Specimen id="card" />
                      <Specimen id="badge" />
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
                    className={`atlas-kit ${area === "templates" ? "kit-template" : "lib-specimen"}`}
                  >
                    {area === "templates" ? (
                      <template.Page key={template.id} />
                    ) : (
                      <Specimen id={picked.id} key={picked.id} />
                    )}
                  </div>
                  {area !== "templates" && (
                    <section className="lib-use">
                      <h2>使用方法</h2>
                      <pre>{picked.usage}</pre>
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
