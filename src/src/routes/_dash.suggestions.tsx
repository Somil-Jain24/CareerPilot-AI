import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { Reveal } from "@/components/ui-ext/reveal";
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/suggestions")({
  head: () => ({ meta: [{ title: "AI Suggestions — CareerPilot AI" }] }),
  component: SuggestionsPage,
});

const original = `EXPERIENCE
Software Developer — Acme Corp (2022–Present)
- Worked on the web app
- Helped with the team
- Did bug fixes and features
- Used React and some backend stuff`;

const improved = `EXPERIENCE
Software Developer — Acme Corp (2022–Present)
- Shipped 12+ features for a React/TypeScript web app serving 40k MAU
- Cut page load time 38% by code-splitting and lazy-loading routes
- Reduced production bugs 25% by introducing unit tests (Jest, 80% coverage)
- Mentored 2 junior devs and led weekly code reviews`;

function SuggestionsPage() {
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <PageHeader
        title="AI Suggestions"
        subtitle="See your resume rewritten for measurable impact."
        action={
          <div className="flex gap-2">
            <button
              onClick={() => copy(improved)}
              className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2.5 text-sm font-medium transition-transform hover:scale-[1.03]"
            >
              <Copy className="h-4 w-4" /> Copy
            </button>
            <button
              onClick={() => toast.success("Download started")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.03]"
            >
              <Download className="h-4 w-4" /> Download DOCX
            </button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <GlassCard hover={false} className="h-full p-0">
            <div className="sticky top-16 z-10 flex items-center justify-between rounded-t-2xl border-b border-border bg-muted/30 px-5 py-3 backdrop-blur">
              <span className="text-sm font-semibold text-muted-foreground">Original</span>
            </div>
            <pre className="whitespace-pre-wrap p-5 font-mono text-sm leading-relaxed text-muted-foreground">
              {original}
            </pre>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard hover={false} glow="success" className="h-full p-0">
            <div className="sticky top-16 z-10 flex items-center justify-between rounded-t-2xl border-b border-success/30 bg-success/10 px-5 py-3 backdrop-blur">
              <span className="flex items-center gap-2 text-sm font-semibold text-success">
                <Sparkles className="h-4 w-4" /> AI Improved
              </span>
              <button onClick={() => copy(improved)} className="text-success hover:opacity-80">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <pre className="whitespace-pre-wrap p-5 font-mono text-sm leading-relaxed text-foreground">
              {improved}
            </pre>
          </GlassCard>
        </Reveal>
      </div>
    </>
  );
}
