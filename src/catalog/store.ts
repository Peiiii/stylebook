import { entries, findEntry, styles } from "./entries";
import type { Entry } from "./entries";

// URL is the sole owner of navigation, shared preview conditions and selection.
export class CatalogStore {
  private listeners = new Set<() => void>();
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  snapshot = () => window.location.hash;
  start = () => {
    window.addEventListener("hashchange", this.notify);
    return () => window.removeEventListener("hashchange", this.notify);
  };
  private notify = () => this.listeners.forEach((listener) => listener());
  params = () => new URLSearchParams(window.location.hash.slice(1));
  get = (key: string, fallback = "") => this.params().get(key) ?? fallback;
  list = (key: string) => [
    ...new Set(
      this.get(key)
        .split(",")
        .filter((id) => findEntry(id)),
    ),
  ];
  patch = (values: Record<string, string | null>, replace = false) => {
    const params = this.params();
    Object.entries(values).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key),
    );
    const hash = `#${params.toString()}`;
    if (hash === window.location.hash) return;
    if (replace) {
      history.replaceState(null, "", hash);
      this.notify();
    } else window.location.hash = hash;
  };
  toggleCompare = (entry: Entry) => {
    const ids = this.list("ids");
    if (ids.includes(entry.id)) {
      this.patch({ ids: ids.filter((id) => id !== entry.id).join(",") });
      return "";
    }
    const first = findEntry(ids[0]);
    if (first && first.group !== entry.group)
      return `“${entry.title}”属于不同的比较组。请先清空当前比较，已有选择已保留。`;
    const limit = entry.kind === "component" ? 3 : 2;
    if (ids.length >= limit)
      return `这一组最多比较 ${limit} 项。请先移除一项。`;
    this.patch({ ids: [...ids, entry.id].join(",") });
    return "";
  };
  adopt = (entry: Entry) => {
    const previous = this.list("adopt").map((id) => findEntry(id)!);
    const next = previous.filter((e) =>
      entry.kind === "theme" ? e.kind !== "theme" : e.group !== entry.group,
    );
    this.patch({ adopt: [...next.map((e) => e.id), entry.id].join(",") });
  };
  link = (values: Record<string, string>) => {
    const params = this.params();
    Object.entries(values).forEach(([key, value]) => params.set(key, value));
    return `${window.location.origin}${window.location.pathname}#${params.toString()}`;
  };
  adoptionText = () => {
    const selected = this.list("adopt").map((id) => findEntry(id)!);
    return [
      "# UI 风格采用说明",
      "",
      ...selected.flatMap((e) => [
        `## ${e.title}`,
        `- 稳定 ID：\`${e.id}\``,
        `- 视觉约束：${styles[e.style].features}`,
        `- 用途：${e.suitable}`,
        `- 参考：${this.link({ page: "detail", entry: e.id, tab: "preview" })}`,
        `- 干净预览：${this.link({ page: "clean", entry: e.id })}`,
        "- 实际源码：src/examples/Examples.tsx 与 src/examples/examples.css（React、lucide-react、react-markdown；MIT）",
        "",
      ]),
      "请保留内容层级、语义状态、键盘操作与窄屏适配；不要只替换颜色。",
      "预览条件：" +
        this.get("mode", "light") +
        " / " +
        this.get("width", "960") +
        "px / " +
        this.get("state", "normal"),
      location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? "注意：当前为本机链接，其他人无法直接访问；请同时发送截图或代码。"
        : "",
      "源码仓库：https://github.com/Peiiii/ui-atlas",
    ].join("\n");
  };
  filtered = () => {
    const q = this.get("q").trim().toLowerCase();
    const kind = this.get("kind", "theme");
    const purpose = this.get("use");
    return entries.filter(
      (e) =>
        e.kind === kind &&
        (!purpose || e.tags.includes(purpose)) &&
        `${e.title} ${e.id} ${e.summary} ${e.tags.join(" ")}`
          .toLowerCase()
          .includes(q),
    );
  };
}
export const catalog = new CatalogStore();
