import { AnimateIn } from "./AnimateIn";

const MOCK_MESSAGES = [
  {
    role: "bot",
    text: "Hi! I'm here to help. Ask me anything about our product.",
  },
  { role: "user", text: "What plans do you offer?" },
  {
    role: "bot",
    text: "We have a Free plan (100 messages/month) and a Pro plan at $19/month with 2,000 messages and full widget customization.",
  },
];

export function Demo() {
  return (
    <section className="px-4 py-24">
      <AnimateIn className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
          See it in action
        </h2>
        <p className="mb-12 text-center text-fg-muted">
          A preview of the chat widget — live demo available after sign-up.
        </p>
        <div className="flex justify-center">
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface backdrop-blur-panel"
            aria-label="Widget preview"
            role="img"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold">Support Chat</span>
              <span className="cursor-default text-sm text-fg-muted" aria-hidden>
                ×
              </span>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 p-4">
              {MOCK_MESSAGES.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={
                      msg.role === "user"
                        ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-accent px-3 py-2 text-sm text-accent-fg"
                        : "max-w-[80%] rounded-2xl rounded-tl-sm border border-border bg-surface-raised px-3 py-2 text-sm text-fg"
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input mock */}
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-raised px-3 py-2">
                <span className="flex-1 text-sm text-fg-muted">
                  Ask a question…
                </span>
                <span className="text-sm text-fg-muted" aria-hidden>
                  →
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
