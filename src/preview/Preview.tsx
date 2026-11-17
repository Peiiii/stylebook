import { Component, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import type { Entry } from "../catalog/entries";

export class PreviewBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="preview-error" role="alert">
        <TriangleAlert />
        <h2>预览未能加载</h2>
        <p>请刷新页面，或返回目录选择其他条目。</p>
        <a href="#">返回目录</a>
      </div>
    ) : (
      this.props.children
    );
  }
}
export function Preview({
  entry,
  thumbnail = false,
  width = 960,
  mode = "light",
  state = "normal",
  scene = "activity",
}: {
  entry: Entry;
  thumbnail?: boolean;
  width?: number;
  mode?: string;
  state?: string;
  scene?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const frameWidth = thumbnail
    ? entry.kind === "component"
      ? 660
      : 960
    : width;
  const source = `${location.origin}${location.pathname}#${new URLSearchParams({ page: "clean", entry: entry.id, width: String(frameWidth), mode, state, scene })}`;
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([rect]) =>
      setAvailable(rect.contentRect.width),
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    setStatus("loading");
    const timeout = window.setTimeout(() => setStatus("error"), 15000);
    const ready = (event: MessageEvent) => {
      if (
        event.origin === location.origin &&
        event.source === ref.current?.querySelector("iframe")?.contentWindow &&
        event.data === "atlas-preview-ready"
      ) {
        clearTimeout(timeout);
        setStatus("ready");
      }
    };
    window.addEventListener("message", ready);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("message", ready);
    };
  }, [source, attempt]);
  const scale = Math.min(1, available / frameWidth);
  const height = thumbnail
    ? entry.kind === "theme"
      ? 350
      : 260
    : Math.min(780, Math.max(420, 850 * scale));
  return (
    <div className={`preview-wrap ${thumbnail ? "thumbnail" : ""}`}>
      <div ref={ref} className="preview-viewport" style={{ height }}>
        {available > 0 && (
          <iframe
            key={attempt}
            title={`${entry.title}可操作预览`}
            src={source}
            style={{
              left: (available - frameWidth * scale) / 2,
              width: frameWidth,
              height: thumbnail
                ? Math.max(860, height / scale)
                : height / scale,
              transform: `scale(${scale})`,
            }}
            tabIndex={thumbnail ? -1 : 0}
            onError={() => setStatus("error")}
          />
        )}
        {status === "loading" && (
          <span className="preview-loading" role="status">
            正在加载预览…
          </span>
        )}
        {status === "error" && (
          <div className="preview-error" role="alert">
            <TriangleAlert />
            <strong>预览加载失败</strong>
            <p>请检查本地服务，或重新打开。</p>
            <button
              onClick={() => {
                setAttempt((value) => value + 1);
              }}
            >
              重试
            </button>
          </div>
        )}
      </div>
      {!thumbnail && (
        <div className="preview-caption">
          内容宽度 {frameWidth}px{" "}
          <span>
            显示比例 {Math.round(scale * 100)}% · 可在预览内操作与滚动
          </span>
        </div>
      )}
    </div>
  );
}
