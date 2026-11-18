import { AnimateIn } from "./AnimateIn";

const STEPS = [
  {
    number: "01",
    title: "Add your info",
    description:
      "Upload a PDF, Markdown, or plain-text file, or paste your product content directly.",
  },
  {
    number: "02",
    title: "Copy one script tag",
    description:
      "Drop a single <script> snippet onto any website. No frameworks, no build step.",
  },
  {
    number: "03",
    title: "Visitors get answers",
    description:
      'Your AI bot answers questions from your content. Unknown questions get "I don\'t know."',
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-24">
      <AnimateIn className="mx-auto max-w-5xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight">
          How it works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-border bg-surface p-6 backdrop-blur-panel"
            >
              <p className="mb-4 font-mono text-5xl font-bold text-fg-muted">
                {step.number}
              </p>
              <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-fg-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </AnimateIn>
    </section>
  );
}
