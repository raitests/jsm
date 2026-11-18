"use client";

import { useState } from "react";

const SNIPPET = `<script
  src="https://cdn.example.com/widget.js"
  data-key="pk_your_key_here">
</script>`;

export function InstallSnippet() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; silently ignore
    }
  };

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
          One script tag
        </h2>
        <p className="mb-10 text-center text-fg-muted">
          Paste this snippet on any page. No framework, no build step required.
        </p>
        <div className="relative rounded-2xl border border-border bg-surface p-6 backdrop-blur-panel">
          <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-fg">
            {SNIPPET}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute right-4 top-4 rounded-lg border border-border px-2.5 py-1 text-xs text-fg-muted transition-colors hover:text-fg"
            aria-label="Copy install snippet"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </section>
  );
}
