import { ArrowRight, MessageSquare } from "lucide-react";
import registry from "../registry.json";
import { componentReference } from "../references";
import type { AtlasTheme } from "../themes";
import { buttonVariants } from "../ui/button";
import { ReferenceActions } from "./ReferenceActions";

const example = registry.components.find(({ id }) => id === "button");

export function HomeReferenceGuide({ theme }: { theme: AtlasTheme }) {
  if (!example) return null;
  const reference = componentReference(example, theme);

  return (
    <figure
      aria-label="把组件带到 AI 会话"
      className="mx-auto w-full min-w-0 max-w-[34rem] md:col-start-2 md:row-start-1"
    >
      <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
        <span className="font-medium">切换风格</span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-primary"
          />
          当前风格 · {theme.label}
        </span>
      </figcaption>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1.25fr)] gap-2 sm:gap-2.5">
        <div className="flex min-w-0 flex-col rounded-(--atlas-surface-radius) border bg-card">
          <div className="flex min-h-11 items-center justify-between gap-2 border-b px-3 py-1">
            <span className="text-sm font-medium">{reference.name}</span>
            <ReferenceActions reference={reference} />
          </div>
          <div className="flex min-h-16 flex-1 items-center justify-center p-4">
            <span
              aria-hidden="true"
              className={buttonVariants({
                size: "sm",
                className: "pointer-events-none",
              })}
            >
              确认
            </span>
          </div>
          <p className="px-3 pb-3 text-xs text-muted-foreground">
            点右上角，复制引用。
          </p>
        </div>

        <div
          aria-hidden="true"
          className="self-center justify-self-center text-primary"
        >
          <ArrowRight className="size-4 sm:size-5" />
        </div>

        <div className="flex min-w-0 flex-col rounded-(--atlas-surface-radius) border bg-card">
          <div className="flex min-h-11 items-center gap-2 border-b px-3 py-1 text-sm font-medium">
            <MessageSquare
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            发给 AI
          </div>
          <div className="m-2.5 grid min-w-0 gap-1 break-words rounded-(--atlas-surface-radius) bg-secondary px-3 py-2.5 text-xs leading-relaxed text-secondary-foreground">
            <span className="text-sm font-medium">
              Stylebook · {reference.name}
            </span>
            <span>
              预览风格：{theme.label}（{theme.id}）
            </span>
            <span>含预览和 GitHub 源码链接</span>
          </div>
          <p className="mt-auto px-3 pb-3 text-xs text-muted-foreground">
            粘贴引用，再说明你想怎么用。
          </p>
        </div>
      </div>
    </figure>
  );
}
