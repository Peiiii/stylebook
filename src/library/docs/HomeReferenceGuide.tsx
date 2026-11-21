import { ArrowRight, MessageSquare } from "lucide-react";
import registry from "../registry.json";
import { componentReference } from "../references";
import type { AtlasTheme } from "../themes";
import { buttonVariants } from "../ui/button";
import { ReferenceActions } from "./ReferenceActions";

const example = registry.components.find(({ id }) => id === "button");

export function HomeReferenceGuide({
  theme,
  tutorialHref,
}: {
  theme: AtlasTheme;
  tutorialHref: string;
}) {
  if (!example) return null;
  const reference = componentReference(example, theme);

  return (
    <section aria-labelledby="home-reference-title" className="pb-10 sm:pb-14">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2
          id="home-reference-title"
          className="text-2xl font-semibold tracking-tight"
        >
          把组件带到 AI 会话
        </h2>
        <a
          href={tutorialHref}
          className="rounded-sm text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          接入教程
        </a>
      </div>
      <figure className="mx-auto grid max-w-4xl gap-3 rounded-(--atlas-surface-radius) bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_78%)] p-2 sm:gap-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.25fr)] md:items-stretch">
        <div className="flex min-w-0 flex-col rounded-(--atlas-surface-radius) border bg-card">
          <div className="flex min-h-11 items-center justify-between gap-2 border-b px-3 py-1">
            <span className="text-sm font-medium">{reference.name}</span>
            <ReferenceActions reference={reference} />
          </div>
          <div className="flex min-h-22 flex-1 items-center justify-center p-4">
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
            点卡片右上角，复制组件引用。
          </p>
        </div>

        <div
          aria-hidden="true"
          className="self-center justify-self-center text-primary"
        >
          <ArrowRight className="size-5 rotate-90 md:rotate-0" />
        </div>

        <div className="flex min-w-0 flex-col rounded-(--atlas-surface-radius) border bg-card">
          <div className="flex min-h-11 items-center gap-2 border-b px-3 py-1 text-sm font-medium">
            <MessageSquare
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            AI 会话示意
          </div>
          <div className="m-3 ml-7 grid gap-1 rounded-(--atlas-surface-radius) bg-secondary px-3 py-2.5 text-xs leading-relaxed text-secondary-foreground">
            <span className="text-sm font-medium">
              Stylebook · {reference.name}
            </span>
            <span>类型：UI 组件 · 标识：{example.id}</span>
            <span>
              预览风格：{theme.label}（{theme.id}）
            </span>
            <span>含预览和 GitHub 源码链接</span>
          </div>
          <p className="mt-auto px-3 pb-3 text-xs text-muted-foreground">
            粘贴引用，再用自己的话说明用途。
          </p>
        </div>
      </figure>
    </section>
  );
}
