import { useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Copy,
  Ellipsis,
  FileText,
  Folder,
  Inbox,
  Layers,
  ListFilter,
  PanelRight,
  Search,
  Settings2,
  TriangleAlert,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import "./examples.css";

export type ExampleKind =
  | "activity"
  | "settings"
  | "card"
  | "search"
  | "status"
  | "menu"
  | "drawer"
  | "tabs";
export interface ExampleProps {
  style?: "outline" | "soft";
  kind?: ExampleKind;
  mode?: "light" | "dark";
  state?: "normal" | "long" | "empty" | "error";
}
const items = [
  {
    title: "更新项目使用指南",
    detail: "补充首次使用路径与常见问题，让每一次开始都更轻松。",
    time: "10:42",
    status: "done",
    category: "文档",
  },
  {
    title: "检查窄屏阅读体验",
    detail: "核对段落换行、导航位置与操作区，保留完整任务上下文。",
    time: "10:18",
    status: "running",
    category: "设计",
  },
  {
    title: "整理本周交付清单",
    detail: "汇总已完成工作与待确认事项，准备下一次评审。",
    time: "09:50",
    status: "waiting",
    category: "计划",
  },
];
const longTitle =
  "核对跨页面的长标题、内容分组与可访问名称，确保信息增加时依然能够快速定位和继续操作";
export function Status({ value }: { value: string }) {
  const labels: Record<string, string> = {
    done: "已完成",
    running: "进行中",
    waiting: "待处理",
    error: "需要处理",
  };
  const Icon =
    value === "done"
      ? CheckCircle2
      : value === "running"
        ? Clock3
        : value === "error"
          ? TriangleAlert
          : Circle;
  return (
    <span
      className={`ex-status ${value}`}
      role="img"
      aria-label={labels[value]}
      title={labels[value]}
    >
      <Icon size={17} />
    </span>
  );
}
function TaskCard({ long = false }: { long?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <article className="ex-card ex-task">
      <div className="ex-between">
        <span className="ex-tag">设计任务</span>
        <Status value={done ? "done" : "running"} />
      </div>
      <h3>{long ? longTitle : "让下一步，一目了然"}</h3>
      <p>梳理项目首页的信息层级，让进度、负责人和下一步操作各有归属。</p>
      <div className="ex-progress" aria-label="任务进度">
        <span style={{ width: done ? "100%" : "68%" }} />
      </div>
      <div className="ex-between ex-meta">
        <span>{done ? "已完成所有检查" : "已完成 4 / 6 项检查"}</span>
        <span>{done ? "100%" : "68%"}</span>
      </div>
      <footer className="ex-between">
        <span className="ex-person">
          <span className="ex-avatar">林</span> 林晓 · 设计
        </span>
        <button className="ex-btn" onClick={() => setDone(!done)}>
          {done ? <Check size={14} /> : <ArrowRight size={14} />}{" "}
          {done ? "已完成 · 撤销" : "完成检查"}
        </button>
      </footer>
    </article>
  );
}
function SearchSample({ long }: { long: boolean }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("全部");
  const results = items.filter(
    (i) =>
      i.title.includes(query) && (filter === "全部" || i.category === filter),
  );
  return (
    <section>
      <div className="ex-search">
        <Search size={18} />
        <input
          aria-label="搜索任务"
          placeholder="搜索任务、文档或关键词…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="ex-key">⌘ K</span>
      </div>
      <div className="ex-filters">
        <ListFilter size={15} />
        {["全部", "文档", "设计", "计划"].map((x) => (
          <button
            className={filter === x ? "active" : ""}
            key={x}
            onClick={() => setFilter(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="ex-card ex-results">
        {results.length ? (
          results.map((i) => (
            <div className="ex-result" key={i.title}>
              <FileText size={16} />
              <span>{long ? longTitle : i.title}</span>
              <span className="ex-tag">{i.category}</span>
            </div>
          ))
        ) : (
          <div className="ex-empty">
            <Search />
            <h3>没有匹配的任务</h3>
            <button
              className="ex-btn"
              onClick={() => {
                setQuery("");
                setFilter("全部");
              }}
            >
              清除筛选
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
function MenuSample({ long }: { long: boolean }) {
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState("");
  return (
    <div className="ex-menu-stage">
      <div className="ex-card ex-between">
        <span className="ex-person">
          <FileText size={19} /> {long ? longTitle : "项目使用指南"}
        </span>
        <button
          aria-label="文档操作菜单"
          aria-expanded={open}
          className="ex-icon-btn"
          onClick={() => setOpen(!open)}
        >
          <Ellipsis size={20} />
        </button>
      </div>
      {open && (
        <div className="ex-menu" role="menu">
          {[
            { name: "查看文档", icon: FileText },
            { name: "创建副本", icon: Copy },
            { name: "加入交付清单", icon: ArrowDownToLine },
          ].map(({ name, icon: Icon }) => (
            <button
              role="menuitem"
              key={name}
              onClick={() => {
                setMessage(`${name}：已选中`);
                setOpen(false);
              }}
            >
              <Icon size={16} />
              {name}
              <ArrowRight size={13} />
            </button>
          ))}
        </div>
      )}
      {message && (
        <p className="ex-notice" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
const definition = `## 好的界面，从明确的下一步开始

这个项目空间用于记录工作进展、共享决策依据，并让每一项待办都有清晰的归属。信息不是越少越好，而是应该在需要的时候出现在合适的位置。

### 工作原则

- **先看结果**：把本次进展与下一步放在最容易扫描的位置。
- **保留上下文**：查看详情时，仍能回到原来的列表。
- **明确反馈**：完成、等待和异常使用不同的语义状态。

> 对需要解释原因的状态，图标与简短说明一起出现。

### 配置示例

\`\`\`json
{
  "review": "before-publish",
  "notifications": true,
  "retentionDays": 30
}
\`\`\`

更多说明见[使用原则](https://www.w3.org/WAI/fundamentals/accessibility-intro/)。`;
function Reading({ long }: { long: boolean }) {
  return (
    <article className="ex-card ex-markdown">
      <div className="ex-section-kicker">
        <FileText size={15} /> 项目定义 <span className="ex-tag">Markdown</span>
      </div>
      <ReactMarkdown>
        {definition +
          (long
            ? "\n\n### 信息增加时的阅读\n\n" +
              [
                "当一个项目逐步增长，说明文档会包含更多背景、约束与决策。先用小标题说明段落主题，再把相关的信息放在一起，读者就能先扫描结构，再进入感兴趣的内容。",
                "每一项规则都应该回答一个具体问题：在什么情况下使用，谁负责执行，以及发生异常时从哪里继续。把原因与操作放在相邻位置，可以减少反复查找，也让新的协作者更容易理解已有选择。",
                "信息密集时，保持稳定的行高与适当的行长。引用用于标出值得停下来的原则，代码块则提供可以直接核对的配置。不要为了让一屏容纳更多内容而持续缩小正文。",
                "策略设置与说明文档共同构成工作约定。调整通知、复核或记录保留周期时，先考虑这些设置如何影响日常工作，再检查反馈是否明确。未填写的补充说明应该与加载失败有不同表达。",
                "完成修改后，回到真实任务中复核：能否找到当前状态，能否理解下一步，遇到错误是否仍保留上下文。阅读体验的目标是帮助人继续行动，而不是让内容看起来更少。",
              ].join("\n\n")
            : "")}
      </ReactMarkdown>
    </article>
  );
}
function Policies() {
  const [notify, setNotify] = useState(true);
  const [review, setReview] = useState(true);
  const [days, setDays] = useState("30");
  const [saved, setSaved] = useState(false);
  return (
    <section className="ex-card">
      <div className="ex-section-kicker">
        <Settings2 size={16} /> 策略设置
      </div>
      <h3>让工作按你的节奏推进</h3>
      <p>发布前检查与通知偏好集中管理。</p>
      <div className="ex-setting">
        <div>
          <strong>发布前复核</strong>
          <small>交付前再次核对内容与链接</small>
        </div>
        <button
          className={`ex-switch ${review ? "on" : ""}`}
          role="switch"
          aria-label="发布前复核"
          aria-checked={review}
          onClick={() => {
            setReview(!review);
            setSaved(false);
          }}
        >
          <span />
        </button>
      </div>
      <div className="ex-setting">
        <div>
          <strong>进度通知</strong>
          <small>重要状态变化时提醒</small>
        </div>
        <button
          className={`ex-switch ${notify ? "on" : ""}`}
          role="switch"
          aria-label="进度通知"
          aria-checked={notify}
          onClick={() => {
            setNotify(!notify);
            setSaved(false);
          }}
        >
          <span />
        </button>
      </div>
      <label className="ex-setting">
        <span>
          <strong>记录保留</strong>
          <small>只影响当前演示设置</small>
        </span>
        <select
          aria-label="记录保留"
          value={days}
          onChange={(e) => {
            setDays(e.target.value);
            setSaved(false);
          }}
        >
          <option value="7">7 天</option>
          <option value="30">30 天</option>
          <option value="90">90 天</option>
        </select>
      </label>
      <div className="ex-setting">
        <span>
          <strong>补充说明</strong>
          <small>未填写</small>
        </span>
        <span className="ex-muted">—</span>
      </div>
      <button className="ex-btn primary" onClick={() => setSaved(true)}>
        {saved ? <Check size={15} /> : <Settings2 size={15} />}{" "}
        {saved ? "已应用到当前预览" : "应用设置"}
      </button>
      <span role="status" className="ex-save-status">
        {saved ? `记录保留 ${days} 天` : ""}
      </span>
    </section>
  );
}
function TabsSample({ long }: { long: boolean }) {
  const [tab, setTab] = useState("概览");
  return (
    <div>
      <div className="ex-tabs" role="tablist" aria-label="项目内容">
        {["概览", "定义", "策略"].map((x) => (
          <button
            role="tab"
            aria-selected={tab === x}
            key={x}
            onClick={() => setTab(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="ex-tab-body">
        {tab === "概览" ? (
          <TaskCard long={long} />
        ) : tab === "定义" ? (
          <Reading long={long} />
        ) : (
          <Policies />
        )}
      </div>
    </div>
  );
}
function DrawerSample({ long }: { long: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="ex-drawer-stage">
      <div className="ex-card">
        <h3>交付清单</h3>
        {items.map((i) => (
          <button
            className="ex-drawer-row"
            key={i.title}
            onClick={() => setOpen(true)}
          >
            <Status value={i.status} />
            <span>{long ? longTitle : i.title}</span>
            <PanelRight size={15} />
          </button>
        ))}
      </div>
      {open && (
        <aside className="ex-drawer" aria-label="任务详情">
          <div className="ex-between">
            <span className="ex-section-kicker">任务详情</span>
            <button
              className="ex-icon-btn"
              aria-label="关闭任务详情"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <span className="ex-tag">文档</span>
          <h3>更新项目使用指南</h3>
          <p>补充首次使用路径与常见问题，让每一次开始都更轻松。</p>
          <div className="ex-setting">
            <span>当前状态</span>
            <Status value="done" />
          </div>
          <div className="ex-setting">
            <span>负责人</span>
            <span>林晓</span>
          </div>
          <div className="ex-note">
            交付说明与正文放在一起，查看详情时保留列表上下文。
          </div>
        </aside>
      )}
    </div>
  );
}
function ActivityPage({
  state,
}: {
  state: NonNullable<ExampleProps["state"]>;
}) {
  const [filter, setFilter] = useState("全部活动");
  const [selected, setSelected] = useState<string | null>(null);
  const shown = state === "long" ? [...items, ...items, ...items] : items;
  return (
    <>
      <div className="ex-page-title">
        <div>
          <div className="ex-eyebrow">WORKSPACE / OVERVIEW</div>
          <h1>把进展，放在一起。</h1>
          <p>每一个小小的完成，都让项目向前一步。</p>
        </div>
        <span className="ex-date">11 月 18 日 · 周三</span>
      </div>
      <div className="ex-stats">
        <div className="ex-card">
          <span>本周完成</span>
          <strong>
            12 <small>项任务</small>
          </strong>
          <span className="ex-trend">
            <CheckCircle2 size={14} /> 按计划推进
          </span>
        </div>
        <div className="ex-card">
          <span>进行中</span>
          <strong>
            04 <small>项任务</small>
          </strong>
          <span className="ex-muted">下一次检查 · 今天 14:00</span>
        </div>
        <div className="ex-card">
          <span>待确认</span>
          <strong>
            02 <small>个事项</small>
          </strong>
          <span className="ex-muted">保持清晰，再继续行动</span>
        </div>
      </div>
      <div className="ex-main-grid">
        <section className="ex-card ex-feed">
          <div className="ex-between">
            <h2>
              最近活动{" "}
              <span className="ex-count">
                {state === "empty" ? 0 : shown.length}
              </span>
            </h2>
            <button
              className="ex-btn"
              onClick={() =>
                setFilter(filter === "全部活动" ? "已完成" : "全部活动")
              }
            >
              {filter}
              <ChevronDown size={14} />
            </button>
          </div>
          {state === "error" && (
            <div className="ex-error">
              <TriangleAlert size={18} />
              <div>
                <strong>部分记录暂时无法加载</strong>
                <p>已有内容仍可查看。切回正常状态可恢复完整记录。</p>
              </div>
            </div>
          )}
          {state === "empty" ? (
            <div className="ex-empty">
              <Inbox size={32} />
              <h3>还没有活动记录</h3>
              <p>完成第一项工作后，进展会出现在这里。</p>
            </div>
          ) : (
            shown
              .filter((i) => filter !== "已完成" || i.status === "done")
              .map((i, index) => (
                <button
                  className="ex-feed-row"
                  key={`${i.title}-${index}`}
                  onClick={() => setSelected(i.title)}
                >
                  <div className="ex-timeline">
                    <Status value={i.status} />
                  </div>
                  <div className="ex-feed-copy">
                    <div className="ex-between">
                      <strong>
                        {state === "long" && index === 1 ? longTitle : i.title}
                      </strong>
                      <time>{i.time}</time>
                    </div>
                    <p>{i.detail}</p>
                    <span className="ex-tag">{i.category}</span>
                    <span className="ex-inline-meta">项目空间 / 交付计划</span>
                  </div>
                  <ArrowRight size={15} />
                </button>
              ))
          )}
        </section>
        <aside className="ex-side">
          <TaskCard />
          <div className="ex-note">
            <span className="ex-eyebrow">A LITTLE CLARITY</span>
            <h3>先看重要的，再看全部。</h3>
            <p>用明确的分组，把注意力留给真正需要处理的事情。</p>
          </div>
        </aside>
      </div>
      {selected && (
        <div className="ex-inline-detail">
          <div className="ex-between">
            <h3>{selected}</h3>
            <button
              className="ex-icon-btn"
              aria-label="关闭活动详情"
              onClick={() => setSelected(null)}
            >
              <X size={18} />
            </button>
          </div>
          <p>任务已分配至项目交付计划。先核对内容，再继续下一步。</p>
          <Status value="done" />
        </div>
      )}
    </>
  );
}
function SettingsPage({
  state,
}: {
  state: NonNullable<ExampleProps["state"]>;
}) {
  const [tab, setTab] = useState("定义与策略");
  return (
    <>
      <div className="ex-page-title">
        <div>
          <div className="ex-eyebrow">WORKSPACE / DEFINITION</div>
          <h1>给工作一个清晰的定义。</h1>
          <p>把原则写下来，也把选择留在手边。</p>
        </div>
        <span className="ex-tag">项目空间</span>
      </div>
      <div className="ex-tabs" role="tablist" aria-label="设置内容">
        {["定义与策略", "变更记录"].map((x) => (
          <button
            role="tab"
            aria-selected={tab === x}
            key={x}
            onClick={() => setTab(x)}
          >
            {x}
          </button>
        ))}
      </div>
      {tab === "变更记录" ? (
        <div className="ex-card ex-empty">
          <Clock3 size={28} />
          <h3>当前预览暂无变更记录</h3>
          <p>应用策略可查看即时反馈。</p>
        </div>
      ) : (
        <>
          {state === "error" && (
            <div className="ex-error">
              <TriangleAlert size={18} />
              策略服务暂不可用。你仍可以阅读定义和调整当前预览。
            </div>
          )}
          <div className="ex-settings-grid">
            {state === "empty" ? (
              <article className="ex-card ex-empty">
                <FileText size={30} />
                <h3>还没有项目定义</h3>
                <p>先写下目标，再确定工作原则。</p>
              </article>
            ) : (
              <Reading long={state === "long"} />
            )}
            <Policies />
          </div>
        </>
      )}
    </>
  );
}
export function Example({
  style = "outline",
  kind = "activity",
  mode = "light",
  state = "normal",
}: ExampleProps) {
  const fullPage = kind === "activity" || kind === "settings";
  return (
    <div
      className={`example ex-${style} ex-${mode} ${fullPage ? "ex-page" : "ex-component"}`}
    >
      {fullPage && (
        <header className="ex-header">
          <div className="ex-brand">
            <span className="ex-brand-icon">
              <Layers size={19} />
            </span>{" "}
            项目空间 <span className="ex-header-divider" />{" "}
            <span className="ex-header-sub">Fieldnotes</span>
          </div>
          <div className="ex-header-actions">
            <span className="ex-person">
              <span className="ex-dot" /> 所有更改已同步
            </span>
            <Bell size={17} />
            <span className="ex-avatar">林</span>
          </div>
        </header>
      )}
      {fullPage ? (
        <div className="ex-page-body">
          <nav className="ex-nav" aria-label="工作区">
            <span className={kind === "activity" ? "active" : ""}>
              <Activity size={16} /> 概览
            </span>
            <span>
              <Folder size={16} /> 项目
            </span>
            <span className={kind === "settings" ? "active" : ""}>
              <Settings2 size={16} /> 定义与策略
            </span>
          </nav>
          {kind === "activity" ? (
            <ActivityPage state={state} />
          ) : (
            <SettingsPage state={state} />
          )}
        </div>
      ) : (
        <div className="ex-component-body">
          <div className="ex-component-heading">
            <span className="ex-eyebrow">FIELDNOTES / COMPONENT</span>
            <h2>
              {
                {
                  card: "独立信息，清晰呈现",
                  search: "找到你关心的内容",
                  status: "一眼识别当前状态",
                  menu: "让操作各就其位",
                  drawer: "细节，就在手边",
                  tabs: "同一对象，不同视角",
                  activity: "",
                  settings: "",
                }[kind]
              }
            </h2>
          </div>
          {state === "error" && (
            <div className="ex-error">
              <TriangleAlert size={18} />
              当前操作未完成，请保留内容后重试。
            </div>
          )}
          {state === "empty" ? (
            <div className="ex-card ex-empty">
              <Inbox size={30} />
              <h3>暂无内容</h3>
              <p>内容出现后，会显示在这里。</p>
            </div>
          ) : kind === "card" ? (
            <TaskCard long={state === "long"} />
          ) : kind === "search" ? (
            <SearchSample long={state === "long"} />
          ) : kind === "status" ? (
            <div className="ex-card ex-status-list">
              {["done", "running", "waiting", "error"].map((v, i) => (
                <div className="ex-between" key={v}>
                  <span className="ex-person">
                    <Status value={v} />
                    {state === "long"
                      ? longTitle
                      : [
                          "使用指南已更新",
                          "设计检查正在进行",
                          "等待下一次复核",
                          "无法同步，需要重试",
                        ][i]}
                  </span>
                  <span className="ex-tag">
                    {["文档", "设计", "计划", "同步"][i]}
                  </span>
                </div>
              ))}
            </div>
          ) : kind === "menu" ? (
            <MenuSample long={state === "long"} />
          ) : kind === "drawer" ? (
            <DrawerSample long={state === "long"} />
          ) : (
            <TabsSample long={state === "long"} />
          )}
        </div>
      )}
    </div>
  );
}
