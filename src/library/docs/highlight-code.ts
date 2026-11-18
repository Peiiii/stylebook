import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import githubLight from "shiki/themes/github-light.mjs";
import githubDark from "shiki/themes/github-dark.mjs";
import tsx from "shiki/langs/tsx.mjs";
import ts from "shiki/langs/typescript.mjs";
import css from "shiki/langs/css.mjs";
import json from "shiki/langs/json.mjs";

const highlighter = createHighlighterCore({
  themes: [githubLight, githubDark],
  langs: [tsx, ts, css, json],
  engine: createJavaScriptRegexEngine(),
});

// Browser port of the upstream highlight-code.ts renderer.
export async function highlightCode(code: string, language: string) {
  const renderer = await highlighter;
  return renderer.codeToHtml(code, {
    lang: ["tsx", "ts", "css", "json"].includes(language) ? language : "text",
    themes: { dark: "github-dark", light: "github-light" },
    transformers: [
      {
        pre(node) {
          node.properties.class =
            "no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto px-4 py-3.5 outline-none !bg-transparent";
        },
        code(node) {
          node.properties["data-line-numbers"] = "";
        },
        line(node) {
          node.properties["data-line"] = "";
        },
      },
    ],
  });
}
