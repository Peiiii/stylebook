import { useEffect, useState } from "react";
import { FileCodeIcon } from "lucide-react";
import { CopyButton } from "./CopyButton";

type Highlight = typeof import("./highlight-code").highlightCode;

// The upstream ComponentCode figure and copy control are kept. Vite supplies
// the same file used by the preview instead of loading a Next.js registry item.
export function ComponentSource({
  code,
  title,
  maxLines,
}: {
  code: string;
  title?: string;
  maxLines?: number;
}) {
  const value = maxLines
    ? code.split("\n").slice(0, maxLines).join("\n")
    : code;
  const [rendered, setRendered] = useState({ source: "", html: "" });
  const language = title?.split(".").pop() ?? "tsx";

  useEffect(() => {
    let current = true;
    import("./highlight-code")
      .then(({ highlightCode }) =>
        (highlightCode satisfies Highlight)(value, language),
      )
      .then((html) => {
        if (current) setRendered({ source: value, html });
      })
      .catch(() => {});
    return () => {
      current = false;
    };
  }, [value, language]);

  return (
    <figure
      data-rehype-pretty-code-figure=""
      className="relative [&>pre]:max-h-96"
    >
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
          data-language={language}
        >
          <FileCodeIcon />
          {title}
        </figcaption>
      )}
      {!maxLines && <CopyButton value={value} />}
      {rendered.source === value ? (
        <div
          data-not-typeset
          dangerouslySetInnerHTML={{ __html: rendered.html }}
        />
      ) : (
        <pre>
          <code>{value}</code>
        </pre>
      )}
    </figure>
  );
}
