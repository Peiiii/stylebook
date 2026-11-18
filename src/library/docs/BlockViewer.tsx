import { Fullscreen } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

// Trimmed official apps/v4/components/block-viewer.tsx / blocks-nav.tsx:
// registry metadata and file tree come from the local imported registry.
export function BlockViewer({
  title,
  description,
  id,
  href,
  links,
}: {
  title: string;
  description: string;
  id: string;
  href: string;
  links: { name: string; href: string; active: boolean }[];
}) {
  return (
    <main className="container-wrapper min-w-0 px-4 py-8 md:px-8">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </header>
      <div className="relative mb-6 overflow-hidden">
        <ScrollArea className="max-w-none">
          <nav className="flex min-w-max items-center" aria-label="页面模板">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-active={link.active}
                aria-current={link.active ? "page" : undefined}
                className="flex h-7 items-center justify-center px-4 text-center text-base font-medium text-muted-foreground transition-colors hover:text-primary data-[active=true]:text-primary"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
      <div
        id={id}
        className="group/block-view-wrapper flex min-w-0 scroll-mt-24 flex-col items-stretch gap-4 overflow-hidden"
      >
        <div className="flex w-full items-center gap-2 pl-2 md:pr-6">
          <span className="text-sm font-medium">{id}</span>
          <Button
            size="icon"
            variant="ghost"
            className="ml-auto size-8 rounded-sm p-0"
            asChild
            title="在新标签页打开"
          >
            <a href={href} target="_blank" rel="noreferrer">
              <span className="sr-only">在新标签页打开</span>
              <Fullscreen />
            </a>
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border">
          <iframe
            src={href}
            title={`${title}预览`}
            height={id === "login-01" ? 600 : 840}
            loading="lazy"
            className="relative z-20 no-scrollbar w-full bg-background"
          />
        </div>
      </div>
    </main>
  );
}
