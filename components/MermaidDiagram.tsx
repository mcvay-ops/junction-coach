"use client";

import { useEffect, useRef, useState } from "react";

export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "strict",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        });
        const id = `mmd-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setErr(null);
        }
      } catch (e) {
        if (!cancelled) setErr((e as Error).message);
      }
    };
    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (err) {
    return (
      <pre className="code-block whitespace-pre-wrap text-xs text-red-500">
        {`Mermaid render error: ${err}\n\n${chart}`}
      </pre>
    );
  }
  return (
    <div
      ref={ref}
      className="overflow-x-auto rounded-lg border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900"
    />
  );
}
