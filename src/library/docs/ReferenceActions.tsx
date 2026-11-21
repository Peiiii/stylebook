import { CodeXml, Copy } from "lucide-react";
import { toast } from "sonner";
import type { StylebookReference } from "../references";
import { Button } from "../ui/button";
import { cn } from "../ui/cn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export async function copyToClipboard(
  text: string,
  successMessage = "已复制引用",
) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
  } catch {
    toast.error("没复制成功，请再试一次");
  }
}

export function ReferenceActions({
  reference,
  showSource = false,
  className,
}: {
  reference: StylebookReference;
  showSource?: boolean;
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={250}>
      <div
        className={cn(
          "flex shrink-0 items-center gap-0.5 text-muted-foreground",
          className,
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label={`复制引用：${reference.name}`}
              onClick={() => copyToClipboard(reference.text)}
            >
              <Copy aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>复制引用</TooltipContent>
        </Tooltip>
        {showSource && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="icon-sm" variant="ghost">
                <a
                  href={reference.sourceHref}
                  aria-label={`查看源码：${reference.name}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <CodeXml aria-hidden="true" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>查看源码</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
