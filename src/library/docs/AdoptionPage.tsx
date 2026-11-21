import { Copy, ExternalLink } from "lucide-react";
import { stylebookSetupPrompt } from "../references";
import { Button } from "../ui/button";
import { copyToClipboard } from "./ReferenceActions";

const examplePath = `${import.meta.env.BASE_URL}adoption-example.html`;
const linkClass = "font-medium text-foreground underline underline-offset-4";

export function AdoptionPage({ themesHref }: { themesHref: string }) {
  return (
    <main className="mx-auto grid max-w-4xl gap-9 px-4 py-8 sm:px-8 sm:py-12">
      <header className="grid max-w-prose gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">接入教程</h1>
        <p className="leading-relaxed text-muted-foreground">
          复制这段话，发给帮你写代码的 AI。
        </p>
        <Button
          type="button"
          className="w-fit"
          onClick={() =>
            copyToClipboard(
              stylebookSetupPrompt,
              "已复制，粘贴到 AI 对话里即可",
            )
          }
        >
          <Copy aria-hidden="true" /> 复制给 AI
        </Button>
        <p className="leading-relaxed text-muted-foreground">
          接着
          <a className={linkClass} href={themesHref}>
            选个风格
          </a>
          ，点「复制引用」发给 AI，再告诉它想用在哪个页面。
        </p>
      </header>

      <section aria-labelledby="adoption-single" className="grid gap-2">
        <h2 id="adoption-single" className="text-xl font-semibold">
          用一种风格
        </h2>
        <p className="text-muted-foreground">
          例如「用 Ant Design 做我的后台。」
        </p>
        <a
          className={`${linkClass} w-fit text-sm`}
          href="#view=blocks&template=sidebar-07&theme=ant"
        >
          看 Ant Design 示例
        </a>
      </section>

      <section aria-labelledby="adoption-multi" className="grid gap-3">
        <h2 id="adoption-multi" className="text-xl font-semibold">
          让用户切换风格
        </h2>
        <p className="text-muted-foreground">
          例如「让用户在设置里切换 iOS、Ant Design 和墨刊。」
        </p>
        <iframe
          src={examplePath}
          title="多主题接入示例"
          loading="lazy"
          className="h-72 w-full rounded-lg border bg-background"
        />
        <a
          className={`${linkClass} inline-flex w-fit items-center gap-1.5 text-sm`}
          href={examplePath}
          target="_blank"
          rel="noreferrer"
        >
          独立打开示例 <ExternalLink aria-hidden="true" className="size-3.5" />
        </a>
      </section>
    </main>
  );
}
