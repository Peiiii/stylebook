import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Columns2,
  ExternalLink,
  Layers,
  Monitor,
  Moon,
  PanelTop,
  Plus,
  Search,
  SlidersHorizontal,
  Smartphone,
  Sun,
  X,
} from "lucide-react";
import { catalog } from "./catalog/store";
import { findEntry, kindLabels, purposes, styles } from "./catalog/entries";
import type { Entry, SampleState } from "./catalog/entries";
import { Example } from "./examples/Examples";
import { Preview, PreviewBoundary } from "./preview/Preview";
import { CopyButton } from "./components/Clipboard";
const Source = lazy(() =>
  import("./pages/Source").then((module) => ({ default: module.Source })),
);
import "./app.css";

function SelectionPanel({ close }: { close: () => void }) {
  const selected = catalog.list("adopt").map((id) => findEntry(id)!);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    const before = document.activeElement as HTMLElement;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const all =
          panel.current?.querySelectorAll<HTMLElement>("button,a,textarea");
        if (!all?.length) return;
        const first = all[0],
          last = all[all.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === panel.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      before?.focus();
    };
  }, [close]);
  return (
    <div className="drawer-scrim" onClick={close}>
      <aside
        ref={panel}
        tabIndex={-1}
        className="selection-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="selection-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="section-line">
          <span className="eyebrow">YOUR SELECTION</span>
          <button
            className="icon-button"
            aria-label="关闭采用清单"
            onClick={close}
          >
            <X size={20} />
          </button>
        </div>
        <h2 id="selection-title">把选择，带到下一次创作。</h2>
        <p>
          选一套整体风格，也可以搭配局部样式。采用说明会保留参考、关键约束和代码位置。
        </p>
        {selected.length ? (
          <>
            <div className="selected-items">
              {selected.map((e) => (
                <div className="selected-item" key={e.id}>
                  <span className={`mini-swatch ${e.style}`} />
                  <div>
                    <small>{kindLabels[e.kind]}</small>
                    <strong>{e.title}</strong>
                    <code>{e.id}</code>
                  </div>
                  <button
                    className="icon-button"
                    aria-label={`移除采用 ${e.title}`}
                    onClick={() =>
                      catalog.patch({
                        adopt: selected
                          .filter((s) => s.id !== e.id)
                          .map((s) => s.id)
                          .join(","),
                      })
                    }
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {!selected.some((e) => e.kind === "theme") && (
              <p className="inline-note">
                当前只选择了局部样式，可继续添加一套整体风格。
              </p>
            )}
            <div className="adoption-actions">
              <CopyButton
                text={catalog.adoptionText()}
                label="复制采用说明"
                className="primary"
              />
              <CopyButton text={catalog.link({})} label="复制当前选择链接" />
            </div>
            <p className="local-note">
              当前为本机页面。给他人分享时，请同时提供截图和采用说明。
            </p>
            <details>
              <summary>展开完整采用说明</summary>
              <pre className="adoption-text">{catalog.adoptionText()}</pre>
            </details>
          </>
        ) : (
          <div className="empty-state">
            <Layers size={32} />
            <h3>还没有选择</h3>
            <p>打开喜欢的条目，点击“采用这个参考”。</p>
            <button className="button" onClick={close}>
              继续浏览
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
function Conditions() {
  return (
    <div className="conditions">
      <div className="condition-group">
        <span className="control-label">视口</span>
        {[
          { value: "960", icon: Monitor, label: "桌面" },
          { value: "390", icon: Smartphone, label: "手机" },
        ].map(({ value, icon: Icon, label }) => (
          <button
            className={catalog.get("width", "960") === value ? "active" : ""}
            key={value}
            onClick={() => catalog.patch({ width: value })}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>
      <div className="condition-group">
        <span className="control-label">预览</span>
        {["light", "dark"].map((x) => (
          <button
            key={x}
            className={catalog.get("mode", "light") === x ? "active" : ""}
            onClick={() => catalog.patch({ mode: x })}
          >
            {x === "light" ? <Sun size={15} /> : <Moon size={15} />}{" "}
            {x === "light" ? "浅色" : "深色"}
          </button>
        ))}
      </div>
      <label className="state-control">
        样例状态
        <select
          aria-label="样例状态"
          value={catalog.get("state", "normal")}
          onChange={(e) => catalog.patch({ state: e.target.value })}
        >
          <option value="normal">正常内容</option>
          <option value="long">长内容</option>
          <option value="empty">空内容</option>
          <option value="error">异常反馈</option>
        </select>
      </label>
    </div>
  );
}
function EntryCard({
  entry,
  compare,
}: {
  entry: Entry;
  compare: (e: Entry) => void;
}) {
  const selected = catalog.list("ids").includes(entry.id);
  return (
    <article className="entry-card">
      <a
        className="card-preview"
        href={catalog.link({ page: "detail", entry: entry.id })}
        aria-label={`查看 ${entry.title}`}
      >
        <Preview entry={entry} thumbnail />
        <span className="preview-open">
          打开预览 <ArrowRight size={15} />
        </span>
        <span className="thumbnail-label">实时预览 · 缩略显示</span>
      </a>
      <div className="entry-info">
        <div className="section-line">
          <span className="eyebrow">
            {entry.kind === "theme"
              ? styles[entry.style].english
              : entry.group.toUpperCase()}
          </span>
          <button
            className={`compare-add ${selected ? "selected" : ""}`}
            aria-label={`${selected ? "移出" : "加入"}比较 ${entry.title}`}
            aria-pressed={selected}
            onClick={() => compare(entry)}
          >
            {selected ? <Check size={14} /> : <Plus size={14} />} 比较
          </button>
        </div>
        <a href={catalog.link({ page: "detail", entry: entry.id })}>
          <h2>{entry.title}</h2>
        </a>
        <p>{entry.summary}</p>
        <div className="card-bottom">
          <div className="tags">
            {entry.tags.slice(0, 2).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <code>{entry.id}</code>
        </div>
      </div>
    </article>
  );
}
function Browse({ compare }: { compare: (e: Entry) => void }) {
  const kind = catalog.get("kind", "theme") as Entry["kind"];
  const filtered = catalog.filtered();
  return (
    <main className="catalog-main">
      <div className="browse-heading">
        <div>
          <div className="eyebrow">
            <span className="accent-line" /> THE INTERFACE COLLECTION · VOL. 01
          </div>
          <h1>
            找到你想要的<span>界面语言。</span>
          </h1>
          <p>真实预览，同条件比较。把模糊的“好看一点”，变成明确的选择。</p>
        </div>
        <div className="edition">
          <span>精编首辑</span>
          <strong>02 / 06 / 02</strong>
          <small>风格 · 组件组 · 完整场景</small>
        </div>
      </div>
      <div className="browse-tools">
        <div className="search-box">
          <Search size={18} />
          <input
            aria-label="搜索目录"
            placeholder="搜索名称、ID 或特征…"
            value={catalog.get("q")}
            onChange={(e) => catalog.patch({ q: e.target.value }, true)}
          />
          {catalog.get("q") && (
            <button
              aria-label="清空搜索"
              className="icon-button"
              onClick={() => catalog.patch({ q: null }, true)}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="purpose-filter">
          <SlidersHorizontal size={15} />
          <span>用途</span>
          <select
            aria-label="筛选用途"
            value={catalog.get("use")}
            onChange={(e) => catalog.patch({ use: e.target.value })}
          >
            {purposes.map((p, i) => (
              <option key={p} value={i ? p : ""}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="collection-label">
        <h2>
          {kindLabels[kind] ?? "整套风格"}{" "}
          <span>{filtered.length.toString().padStart(2, "0")}</span>
        </h2>
        <p>
          {kind === "theme"
            ? "不只是换颜色，从排版到空间都保持一致。"
            : kind === "component"
              ? "从小处选择，让局部也有清楚的表达。"
              : "放进完整页面，看看风格能否承载真实内容。"}
        </p>
      </div>
      {filtered.length ? (
        <div className={`entry-grid ${kind === "theme" ? "theme-grid" : ""}`}>
          {filtered.map((e) => (
            <EntryCard entry={e} key={e.id} compare={compare} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={32} />
          <h2>没有找到匹配的参考</h2>
          <p>已保留搜索“{catalog.get("q")}”和用途筛选。试试更短的关键词。</p>
          <button
            className="button"
            onClick={() => catalog.patch({ q: null, use: null })}
          >
            清除搜索与筛选
          </button>
        </div>
      )}
      <div className="collection-footer">
        <div>
          <span className="footer-mark">◈</span>
          <span>看效果 → 做比较 → 带走选择</span>
        </div>
        <span>原创样例 · MIT 开源 · 无需登录</span>
      </div>
    </main>
  );
}
function Detail({
  entry,
  compare,
  adopt,
}: {
  entry: Entry;
  compare: (e: Entry) => void;
  adopt: (e: Entry) => void;
}) {
  const tab = catalog.get("tab", "preview");
  return (
    <main className="detail-main">
      <div className="detail-heading">
        <div>
          <button
            className="back-button"
            onClick={() => catalog.patch({ page: null })}
          >
            <ArrowLeft size={16} /> 返回目录
          </button>
          <div className="detail-title">
            <h1>{entry.title}</h1>
            <span className="type-tag">{kindLabels[entry.kind]}</span>
          </div>
          <div className="id-row">
            <code>{entry.id}</code>
            <CopyButton text={entry.id} label="复制 ID" />
          </div>
        </div>
        <div className="detail-actions">
          <button className="button" onClick={() => compare(entry)}>
            <Columns2 size={16} />
            {catalog.list("ids").includes(entry.id) ? "移出比较" : "加入比较"}
          </button>
          <button className="button primary" onClick={() => adopt(entry)}>
            <Plus size={16} />
            采用这个参考
          </button>
        </div>
      </div>
      <div className="detail-tabs-row">
        <div className="tabs" role="tablist" aria-label="条目详情">
          {[
            { id: "preview", name: "真实预览", Icon: PanelTop },
            { id: "about", name: "适用说明", Icon: SlidersHorizontal },
            { id: "code", name: "可用代码", Icon: Code2 },
          ].map(({ id, name, Icon }) => (
            <button
              role="tab"
              aria-selected={tab === id}
              className={tab === id ? "active" : ""}
              key={id}
              onClick={() => catalog.patch({ tab: id })}
            >
              <Icon size={15} />
              {name}
            </button>
          ))}
        </div>
        <div className="preview-links">
          <CopyButton
            text={catalog.link({ page: "detail", entry: entry.id })}
            label="复制链接"
          />
          <a
            className="button"
            href={catalog.link({ page: "clean", entry: entry.id })}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={14} /> 干净预览
          </a>
        </div>
      </div>
      {tab === "code" ? (
        <Suspense fallback={<div className="empty-state">正在加载源码…</div>}>
          <Source entry={entry} />
        </Suspense>
      ) : tab === "about" ? (
        <section className="about-grid">
          <div className="about-card">
            <span className="eyebrow">VISUAL LANGUAGE</span>
            <h2>{styles[entry.style].name}</h2>
            <p>{styles[entry.style].features}</p>
            <div className={`style-specimen ${entry.style}`}>
              <span>Aa</span>
              <div>
                <strong>层级清楚，选择明确。</strong>
                <small>Typography · Space · Surface</small>
              </div>
            </div>
          </div>
          <div className="about-card">
            <h3>适合什么</h3>
            <p>{entry.suitable}</p>
            <h3>采用前留意</h3>
            <p>{entry.avoid}</p>
            <h3>来源与边界</h3>
            <p>
              原创通用演示，MIT 许可。图标来自
              Lucide（ISC）。状态与设置只影响当前预览，不连接外部服务。
            </p>
          </div>
        </section>
      ) : (
        <>
          <Conditions />
          {entry.kind === "theme" && (
            <div className="scene-picker">
              <span>整页场景</span>
              {[
                { id: "activity", title: "汇报与活动流" },
                { id: "settings", title: "定义与策略设置" },
              ].map((x) => (
                <button
                  className={
                    catalog.get("scene", "activity") === x.id ? "active" : ""
                  }
                  key={x.id}
                  onClick={() => catalog.patch({ scene: x.id })}
                >
                  {x.title}
                </button>
              ))}
            </div>
          )}
          <Preview
            entry={entry}
            width={catalog.get("width", "960") === "390" ? 390 : 960}
            mode={catalog.get("mode", "light")}
            state={catalog.get("state", "normal")}
            scene={catalog.get("scene", "activity")}
          />
        </>
      )}
    </main>
  );
}
function Compare({ adopt }: { adopt: (e: Entry) => void }) {
  const ids = catalog.list("ids");
  const chosen = ids.map((id) => findEntry(id)!);
  const [mobileIndex, setMobileIndex] = useState(0);
  if (chosen.length < 2)
    return (
      <main className="detail-main">
        <button
          className="back-button"
          onClick={() => catalog.patch({ page: null })}
        >
          <ArrowLeft size={16} /> 返回目录
        </button>
        <div className="empty-state">
          <Columns2 size={32} />
          <h2>再选一项，开始比较</h2>
          <p>同一比较组至少需要两个参考；已有选择仍在下方保留。</p>
          <button
            className="button"
            onClick={() => catalog.patch({ page: null })}
          >
            继续选择
          </button>
        </div>
      </main>
    );
  if (chosen.some((e) => e.group !== chosen[0].group))
    return (
      <main className="empty-state">
        <h2>这些条目不属于同一比较组</h2>
        <p>请清空比较后，选择同一组条目。</p>
        <button
          className="button"
          onClick={() => catalog.patch({ ids: null, page: null })}
        >
          清空并返回目录
        </button>
      </main>
    );
  return (
    <main className="compare-main">
      <div className="detail-heading">
        <div>
          <button
            className="back-button"
            onClick={() => catalog.patch({ page: null })}
          >
            <ArrowLeft size={16} /> 返回目录
          </button>
          <h1>让差别，看得见。</h1>
          <p>相同内容、状态与视口。先比较，再决定。</p>
        </div>
        <CopyButton text={catalog.link({})} label="复制比较链接" />
      </div>
      <Conditions />
      {chosen[0].kind === "theme" && (
        <div className="scene-picker">
          <span>共同场景</span>
          {["activity", "settings"].map((x) => (
            <button
              className={catalog.get("scene", "activity") === x ? "active" : ""}
              key={x}
              onClick={() => catalog.patch({ scene: x })}
            >
              {x === "activity" ? "汇报与活动流" : "定义与策略设置"}
            </button>
          ))}
        </div>
      )}
      <div className="mobile-compare-tabs">
        {chosen.map((e, i) => (
          <button
            className={mobileIndex === i ? "active" : ""}
            key={e.id}
            onClick={() => setMobileIndex(i)}
          >
            {String.fromCharCode(65 + i)} · {styles[e.style].name}
          </button>
        ))}
      </div>
      <div
        className="compare-grid"
        style={{
          gridTemplateColumns: `repeat(${chosen.length}, minmax(0,1fr))`,
        }}
      >
        {chosen.map((e, i) => (
          <section
            className={`compare-column ${i === Math.min(mobileIndex, chosen.length - 1) ? "mobile-active" : ""}`}
            key={e.id}
          >
            <div className="compare-column-heading">
              <div>
                <small>REFERENCE {String.fromCharCode(65 + i)}</small>
                <h2>{e.title}</h2>
                <code>{e.id}</code>
              </div>
              <button
                className="icon-button"
                aria-label={`移除比较 ${e.title}`}
                onClick={() => catalog.toggleCompare(e)}
              >
                <X size={16} />
              </button>
            </div>
            <Preview
              entry={e}
              width={catalog.get("width", "960") === "390" ? 390 : 960}
              mode={catalog.get("mode", "light")}
              state={catalog.get("state", "normal")}
              scene={catalog.get("scene", "activity")}
            />
            <div className="compare-column-footer">
              <a
                className="button"
                href={catalog.link({ page: "detail", entry: e.id })}
              >
                单项放大 <ExternalLink size={13} />
              </a>
              <button className="button primary" onClick={() => adopt(e)}>
                采用 <ArrowRight size={14} />
              </button>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
export default function App() {
  const routeHash = useSyncExternalStore(catalog.subscribe, catalog.snapshot);
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(catalog.start, []);
  const page = catalog.get("page");
  const entry = findEntry(catalog.get("entry"));
  const mode = catalog.get("mode", "light") === "dark" ? "dark" : "light";
  const state = ["normal", "long", "empty", "error"].includes(
    catalog.get("state", "normal"),
  )
    ? (catalog.get("state", "normal") as SampleState)
    : "normal";
  useEffect(() => {
    if (page === "clean")
      window.parent.postMessage("atlas-preview-ready", location.origin);
  }, [page, routeHash]);
  useEffect(() => {
    document.title = entry
      ? `${entry.title} · UI Atlas`
      : "UI Atlas · 界面风格样本册";
  }, [entry]);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 6500);
    return () => clearTimeout(timeout);
  }, [notice]);
  const compare = (e: Entry) => {
    const error = catalog.toggleCompare(e);
    if (error) setNotice(error);
  };
  const adopt = (e: Entry) => {
    catalog.adopt(e);
    setSelectionOpen(true);
  };
  const closeSelection = () => setSelectionOpen(false);
  if (page === "clean")
    return entry ? (
      <PreviewBoundary>
        <div
          className="clean-preview"
          style={{
            width: catalog.get("width", "960") === "390" ? 390 : 960,
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <Example
            key={`${entry.id}-${mode}-${state}`}
            style={entry.style}
            kind={
              entry.kind === "theme"
                ? catalog.get("scene") === "settings"
                  ? "settings"
                  : "activity"
                : entry.example
            }
            mode={mode}
            state={state}
          />
        </div>
      </PreviewBoundary>
    ) : (
      <div className="empty-state">
        <h1>没有找到这个预览</h1>
        <a className="button" href="#">
          返回目录
        </a>
      </div>
    );
  const compared = catalog.list("ids");
  return (
    <div
      className={`atlas ${catalog.get("shell") === "dark" ? "atlas-dark" : ""}`}
    >
      <header className="site-header">
        <a className="brand" href={catalog.link({ page: "", entry: "" })}>
          <span className="brand-symbol">
            <Layers size={21} />
          </span>{" "}
          UI Atlas<span className="brand-edition">/ 01</span>
        </a>
        <nav className="main-nav" aria-label="目录分类">
          {(["theme", "component", "scene"] as const).map((k) => (
            <a
              className={
                catalog.get("kind", "theme") === k && !page ? "active" : ""
              }
              key={k}
              href={catalog.link({ kind: k, page: "", q: "", use: "" })}
            >
              {kindLabels[k]}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="切换目录外壳明暗"
            title="只切换目录外壳，不改变样例"
            onClick={() =>
              catalog.patch({
                shell: catalog.get("shell") === "dark" ? "" : "dark",
              })
            }
          >
            {catalog.get("shell") === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>
          <button
            className="button selection-button"
            onClick={() => setSelectionOpen(true)}
          >
            采用清单 <span>{catalog.list("adopt").length}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </header>
      {page === "detail" ? (
        entry ? (
          <Detail entry={entry} compare={compare} adopt={adopt} />
        ) : (
          <main className="empty-state">
            <h1>没有找到这个条目</h1>
            <p>ID 可能有误或已不存在。已有选型保留在采用清单中。</p>
            <button
              className="button"
              onClick={() => catalog.patch({ page: null, entry: null })}
            >
              返回目录
            </button>
          </main>
        )
      ) : page === "compare" ? (
        <Compare adopt={adopt} />
      ) : (
        <Browse compare={compare} />
      )}
      <footer className="site-footer">
        <a className="brand" href="#">
          UI Atlas
        </a>
        <span>为清晰的选择而设计。</span>
        <a
          href="https://github.com/Peiiii/ui-atlas"
          target="_blank"
          rel="noreferrer"
        >
          开源仓库 ↗
        </a>
      </footer>
      {compared.length > 0 && page !== "compare" && (
        <aside className="compare-tray" aria-label="比较选择">
          <div>
            <Columns2 size={19} />
            <strong>已选 {compared.length} 项</strong>
            <span>
              {compared.map((id) => findEntry(id)?.title).join(" / ")}
            </span>
          </div>
          <div>
            <button
              className="button quiet"
              onClick={() => catalog.patch({ ids: null })}
            >
              清空
            </button>
            <button
              className="button primary"
              disabled={compared.length < 2}
              onClick={() => catalog.patch({ page: "compare" })}
            >
              开始比较 <ArrowRight size={15} />
            </button>
          </div>
        </aside>
      )}
      {notice && (
        <div className="toast" role="alert">
          <span>{notice}</span>
          <button
            className="icon-button"
            aria-label="关闭提示"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {selectionOpen && <SelectionPanel close={closeSelection} />}
    </div>
  );
}
