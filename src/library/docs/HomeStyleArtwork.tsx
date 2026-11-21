import type { AtlasTheme } from "../themes";
import { cn } from "../ui/cn";

export function LayoutSheet({
  className,
  theme,
}: {
  className: string;
  theme?: AtlasTheme["id"];
}) {
  return (
    <div
      data-atlas-theme={theme}
      data-artwork-sheet={theme ?? "current"}
      className={cn(
        "@container absolute grid aspect-[16/11] w-[63%] grid-rows-[18%_1fr] overflow-hidden rounded-(--atlas-surface-radius) border bg-card shadow-lg shadow-black/8",
        className,
      )}
    >
      <div className="flex items-center gap-[2%] border-b px-[5%]">
        <span className="aspect-square w-[5%] rounded-(--atlas-control-radius) bg-primary" />
        <span className="h-[14%] w-[22%] rounded-full bg-foreground/30" />
        <span className="ml-auto h-[18%] w-[10%] rounded-full bg-border" />
      </div>

      <div className="grid min-h-0 grid-cols-[24%_1fr]">
        <div className="grid content-start gap-[1.508cqw] border-r bg-muted/45 p-[15%]">
          <span className="h-[3.492cqw] rounded-(--atlas-control-radius) bg-accent" />
          <span className="h-[0.794cqw] w-[75%] rounded-full bg-foreground/20" />
          <span className="h-[0.794cqw] w-[88%] rounded-full bg-foreground/15" />
          <span className="h-[0.794cqw] w-[64%] rounded-full bg-foreground/15" />
        </div>
        <div className="grid min-h-0 grid-rows-[auto_1fr_.78fr] gap-[1.905cqw] p-[6%]">
          <span className="h-[1.429cqw] w-[60%] rounded-full bg-foreground/55" />
          <div className="grid content-center gap-[1.667cqw] rounded-(--atlas-control-radius) bg-secondary px-[9%]">
            <span className="h-[0.952cqw] w-[62%] rounded-full bg-foreground/35" />
            <span className="h-[0.873cqw] w-[76%] rounded-full bg-foreground/20" />
            <span className="mt-px h-[2.619cqw] w-[32%] rounded-(--atlas-control-radius) bg-primary" />
          </div>
          <div className="grid grid-cols-2 gap-[1.905cqw]">
            <div className="grid content-center gap-[1.032cqw] rounded-(--atlas-control-radius) border px-[12%]">
              <span className="h-[0.873cqw] w-[65%] rounded-full bg-foreground/35" />
              <span className="h-[0.714cqw] w-[80%] rounded-full bg-border" />
            </div>
            <div className="grid content-center gap-[1.032cqw] rounded-(--atlas-control-radius) border px-[12%]">
              <span className="h-[0.873cqw] w-[54%] rounded-full bg-foreground/35" />
              <span className="h-[0.714cqw] w-[76%] rounded-full bg-border" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
