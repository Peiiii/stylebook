import { useEffect, useRef, useState } from "react";
import { ExternalLink, Monitor, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function SceneViewer({ href }: { href: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [initialHref] = useState(href);
  const [width, setWidth] = useState("desktop");

  useEffect(() => {
    const preview = frame.current;
    if (!preview) return;

    function syncTheme() {
      const location = preview?.contentWindow?.location;
      if (location?.hash && location.hash !== href) location.replace(href);
    }

    syncTheme();
    preview.addEventListener("load", syncTheme);
    return () => preview.removeEventListener("load", syncTheme);
  }, [href]);

  return (
    <main className="container-wrapper min-w-0 px-4 py-6 md:px-8 md:py-8">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">场景总览</h1>
      <div className="overflow-hidden rounded-xl border">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-card px-3 py-2">
          <span className="text-sm font-medium">青禾工作室</span>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              size="sm"
              value={width}
              onValueChange={(value) => {
                if (value) setWidth(value);
              }}
              aria-label="预览尺寸"
            >
              <ToggleGroupItem value="desktop" aria-label="桌面预览">
                <Monitor />
              </ToggleGroupItem>
              <ToggleGroupItem value="mobile" aria-label="手机预览">
                <Smartphone />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button variant="ghost" size="sm" asChild>
              <a href={href} target="_blank" rel="noreferrer">
                <ExternalLink />
                独立打开
              </a>
            </Button>
          </div>
        </div>
        <div className="bg-muted">
          <iframe
            ref={frame}
            src={initialHref}
            title="青禾工作室应用预览"
            className={
              width === "mobile"
                ? "mx-auto block h-[min(760px,80svh)] min-h-96 w-full max-w-[390px] border-x bg-background"
                : "block h-[max(600px,78svh)] w-full bg-background"
            }
          />
        </div>
      </div>
    </main>
  );
}
