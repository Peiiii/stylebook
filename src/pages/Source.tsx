import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import exampleSource from "../examples/Examples.tsx?raw";
import cssSource from "../examples/examples.css?raw";
import { CopyButton } from "../components/Clipboard";
import type { Entry } from "../catalog/entries";
export function Source({ entry }: { entry: Entry }) {
  const [file, setFile] = useState<"usage" | "tsx" | "css">("usage");
  const usage = `// npm install react react-dom lucide-react react-markdown\n// 从下方两个源码页签复制完整文件，保存在同一目录。\nimport { Example } from './Examples';\n\nexport default function App() {\n  return <Example style="${entry.style}" kind="${entry.example}" mode="light" state="normal" />;\n}`;
  const code =
    file === "tsx" ? exampleSource : file === "css" ? cssSource : usage;
  return (
    <section className="source-panel">
      <div className="source-intro">
        <div>
          <h2>眼前的预览，就是这份代码。</h2>
          <p>React + TypeScript · Lucide 图标 · react-markdown · 原创 MIT</p>
          <p>
            复制完整 TSX 与 CSS 文件后，按使用方式导入。样例组件不依赖目录外壳。
          </p>
        </div>
        <a
          className="text-link"
          href="https://github.com/Peiiii/ui-atlas/tree/main/src/examples"
          target="_blank"
          rel="noreferrer"
        >
          在 GitHub 查看 ↗
        </a>
      </div>
      <div className="source-toolbar">
        <div className="tabs">
          {(["usage", "tsx", "css"] as const).map((x) => (
            <button
              className={file === x ? "active" : ""}
              key={x}
              onClick={() => setFile(x)}
            >
              {x === "usage"
                ? "使用方式"
                : x === "tsx"
                  ? "Examples.tsx"
                  : "examples.css"}
            </button>
          ))}
        </div>
        <CopyButton text={code} label="复制当前文件" />
      </div>
      <Highlight
        theme={themes.nightOwl}
        code={code}
        language={file === "css" ? "css" : "tsx"}
      >
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre className="source-code" style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line })} key={i}>
                <span className="line-no">{i + 1}</span>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token })} key={key} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </section>
  );
}
