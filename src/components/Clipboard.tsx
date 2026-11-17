import { useState } from "react";
import { Check, Copy, X } from "lucide-react";
export function CopyButton({
  text,
  label = "复制",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setFallback(true);
    }
  };
  return (
    <>
      <button className={`button ${className}`} onClick={copy}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
        <span>{copied ? "已复制" : label}</span>
      </button>
      {fallback && (
        <div className="manual-copy">
          <div className="section-line">
            <strong>剪贴板不可用，请手动选择复制</strong>
            <button
              className="icon-button"
              aria-label="关闭手动复制"
              onClick={() => setFallback(false)}
            >
              <X size={18} />
            </button>
          </div>
          <textarea
            aria-label="手动复制文本"
            readOnly
            value={text}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}
    </>
  );
}
