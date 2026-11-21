import { ExternalLink } from "lucide-react";
import { adoptionGuideUrl, repositoryUrl } from "../references";
import { Button } from "../ui/button";

const examplePath = `${import.meta.env.BASE_URL}adoption-example.html`;
const exampleSource = `${repositoryUrl}/blob/main/src/library/examples/multi-theme-adoption.tsx`;
const linkClass = "font-medium text-foreground underline underline-offset-4";

export function AdoptionPage({ themesHref }: { themesHref: string }) {
  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-4 py-8 sm:px-8 sm:py-12">
      <header className="grid gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">接入教程</h1>
        <p className="max-w-prose leading-relaxed text-muted-foreground">
          从 Stylebook
          选一个组件或一套风格，用到自己的项目里。一个应用可以固定用一套风格，也可以让用户在设置里切换几套。
        </p>
      </header>

      <section aria-labelledby="adoption-steps" className="grid gap-3">
        <h2 id="adoption-steps" className="text-xl font-semibold">
          从选风格到用进项目
        </h2>
        <ol className="grid list-decimal gap-2 pl-5 leading-relaxed text-muted-foreground">
          <li>
            在{" "}
            <a className={linkClass} href={themesHref}>
              主题页
            </a>{" "}
            选风格，打开推荐模板看完整页面。只想用某个组件时，打开它的详情。
          </li>
          <li>
            复制引用，发给你的 AI
            编程工具，并说明用在哪个页面。经常使用时可以加入{" "}
            <a
              className={linkClass}
              href={`${repositoryUrl}/tree/main/skills/stylebook`}
            >
              Stylebook Skill
            </a>
            。
          </li>
          <li>
            在目标项目里对照参考页面，试一下默认、选中、键盘操作和窄屏效果。
          </li>
        </ol>
        <blockquote className="rounded-md border-l-2 border-foreground bg-muted px-4 py-3 text-sm leading-relaxed">
          让设置页支持 iOS、Ant Design 和墨刊，默认
          iOS，放在设置里切换，记住用户上次的选择。
        </blockquote>
      </section>

      <section aria-labelledby="adoption-single" className="grid gap-3">
        <h2 id="adoption-single" className="text-xl font-semibold">
          示例一 · 固定用 Ant Design
        </h2>
        <p className="max-w-prose leading-relaxed text-muted-foreground">
          复用可折叠侧栏模板，在应用根元素设置{" "}
          <code className="text-foreground">data-atlas-theme="ant"</code>
          。同一套样式会覆盖桌面侧栏和手机抽屉。
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <a
            className={linkClass}
            href="#view=blocks&template=sidebar-07&theme=ant"
          >
            预览模板
          </a>
          <a
            className={linkClass}
            href={`${adoptionGuideUrl}#从零跑通-ant-design-的可折叠侧栏`}
          >
            完整接入步骤
          </a>
        </div>
      </section>

      <section aria-labelledby="adoption-multi" className="grid gap-3">
        <h2 id="adoption-multi" className="text-xl font-semibold">
          示例二 · 让用户切换三套风格
        </h2>
        <p className="max-w-prose leading-relaxed text-muted-foreground">
          在下方选择风格，再刷新本页试试。示例只提供 iOS、Ant Design
          和墨刊，默认 iOS，并在当前浏览器保存选择。
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={examplePath} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" /> 独立打开示例
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={exampleSource}>查看示例源码</a>
          </Button>
        </div>
        <iframe
          src={examplePath}
          title="多主题接入示例"
          loading="lazy"
          className="h-72 w-full rounded-lg border bg-background"
        />
        <p className="text-sm leading-relaxed text-muted-foreground">
          接到自己项目时，改成应用允许的主题
          ID，并用项目自己的键保存偏好。两种示例都共用同一套组件和样式。
        </p>
        <a
          className={`${linkClass} text-sm`}
          href={`${adoptionGuideUrl}#从单主题扩展到多主题`}
        >
          在自己的项目里跑通多主题示例
        </a>
      </section>
    </main>
  );
}
