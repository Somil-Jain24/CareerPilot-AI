import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Github, Globe, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { ScoreGauge } from "@/components/ui-ext/score-gauge";
import { Reveal } from "@/components/ui-ext/reveal";

export const Route = createFileRoute("/_dash/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio Review — CareerPilot AI" }] }),
  component: PortfolioPage,
});

const reviews = [
  { title: "Project Quality", value: 81, note: "Good project variety and clean commit history." },
  { title: "Documentation", value: 64, note: "Add architecture notes and setup instructions." },
  { title: "README Quality", value: 58, note: "Improve README clarity with badges and demos." },
];

function PortfolioPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(true);

  const run = () => {
    setLoading(true);
    setDone(false);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1400);
  };

  return (
    <>
      <PageHeader
        title="Portfolio Review"
        subtitle="AI feedback on your GitHub and portfolio site."
      />

      <Reveal>
        <GlassCard hover={false} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">GitHub URL</label>
            <div className="relative">
              <Github className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                defaultValue="github.com/jordandev"
                className="h-11 w-full rounded-xl border border-border bg-muted/20 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Portfolio URL</label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                defaultValue="jordandev.io"
                className="h-11 w-full rounded-xl border border-border bg-muted/20 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <button
            onClick={run}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 text-sm font-semibold text-primary-foreground glow-ring hover:scale-[1.02] disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Review"}
          </button>
        </GlassCard>
      </Reveal>

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {reviews.map((r, i) => (
            <GlassCard key={r.title} hover={false} className="flex flex-col items-center text-center">
              <h3 className="mb-3 font-semibold">{r.title}</h3>
              <ScoreGauge value={r.value} size={150} showLabel={false} />
              <p className="mt-3 text-sm text-muted-foreground">{r.note}</p>
            </GlassCard>
          ))}
        </motion.div>
      )}
    </>
  );
}
