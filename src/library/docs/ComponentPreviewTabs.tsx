import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "../ui/button";
import { cn } from "../ui/cn";

// Retained LTR preview and source branches from shadcn's
// apps/v4/components/component-preview-tabs.tsx.
export function ComponentPreviewTabs({
  component,
  source,
  sourcePreview,
  previewClassName,
}: {
  component: ReactNode;
  source: ReactNode;
  sourcePreview: ReactNode;
  previewClassName?: string;
}) {
  const [isMobileCodeVisible, setIsMobileCodeVisible] = useState(false);
  return (
    <div
      data-slot="component-preview"
      data-not-typeset=""
      className="group relative mt-4 mb-12 flex flex-col overflow-hidden rounded-2xl border"
    >
      <div data-slot="preview" dir="ltr">
        <div
          data-align="center"
          className={cn(
            "preview relative flex min-h-72 w-full justify-center p-6 data-[align=center]:items-center sm:p-10",
            previewClassName,
          )}
          onSubmit={(event) => event.preventDefault()}
          onClick={(event) => {
            if (!(event.target instanceof Element)) return;
            const anchor = event.target.closest("a");
            if (anchor?.origin === location.origin) event.preventDefault();
          }}
        >
          {component}
        </div>
      </div>
      <div
        data-slot="code"
        data-mobile-code-visible={isMobileCodeVisible}
        className="relative overflow-hidden [&_pre]:max-h-72"
      >
        {isMobileCodeVisible ? (
          source
        ) : (
          <div className="relative">
            {sourcePreview}
            <div className="absolute inset-0 flex items-center justify-center pb-4">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, var(--code), color-mix(in oklab, var(--code) 60%, transparent), transparent)",
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="relative z-10 rounded-lg bg-background text-foreground shadow-none hover:bg-muted"
                onClick={() => setIsMobileCodeVisible(true)}
              >
                查看示例源码
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
