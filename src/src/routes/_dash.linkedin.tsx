import { createFileRoute } from "@tanstack/react-router";
import { Copy, Check, Linkedin } from "lucide-react";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { Reveal } from "@/components/ui-ext/reveal";
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/linkedin")({
  head: () => ({ meta: [{ title: "LinkedIn Optimizer — CareerPilot AI" }] }),
  component: LinkedinPage,
});

const sections = [
  {
    label: "Headline",
    current: "Software Developer at Acme Corp",
    improved:
      "Full-Stack Engineer · React + TypeScript · Building scalable web apps for 40k+ users",
  },
  {
    label: "About",
    current:
      "I am a developer who likes coding and building things. I work with web technologies.",
    improved:
      "Full-stack engineer with 3+ years shipping production React/TypeScript apps. I cut load times by 38%, raised test coverage to 80%, and mentor junior devs. Passionate about clean architecture and measurable impact.",
  },
  {
    label: "Skills",
    current: "JavaScript, HTML, CSS",
    improved:
      "React · TypeScript · Node.js · REST APIs · System Design · CI/CD · Testing (Jest) · Tailwind CSS",
  },
];

function LinkedinPage() {
  const copy = (t: string) => {
    navigator.clipboard?.writeText(t);
    toast.success("Copied");
  };

  return (
    <>
      <PageHeader
        title="LinkedIn Optimizer"
        subtitle="Sharpen your profile for keyword density and recruiter appeal."
        action={
          <span className="inline-flex items-center gap-2 rounded-xl bg-secondary/15 px-4 py-2.5 text-sm font-medium text-secondary">
            <Linkedin className="h-4 w-4" /> Profile strength: 72%
          </span>
        }
      />

      <div className="space-y-6">
        {sections.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <GlassCard hover={false}>
              <h3 className="mb-4 font-semibold">{s.label}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/25 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Current
                  </p>
                  <p className="text-sm text-muted-foreground">{s.current}</p>
                </div>
                <div className="rounded-xl border border-success/30 bg-success/10 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success">
                      <Check className="h-3.5 w-3.5" /> Improved
                    </p>
                    <button onClick={() => copy(s.improved)} className="text-success hover:opacity-80">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-foreground">{s.improved}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => copy(s.improved)}
                  className="rounded-lg glass px-4 py-2 text-sm font-medium hover:scale-[1.03]"
                >
                  Copy Text
                </button>
                <button
                  onClick={() => toast.success(`${s.label} updated`)}
                  className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-ring hover:scale-[1.03]"
                >
                  Apply Changes
                </button>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </>
  );
}
