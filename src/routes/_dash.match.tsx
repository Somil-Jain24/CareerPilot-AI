import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { ScoreGauge } from "@/components/ui-ext/score-gauge";
import { ProgressBar } from "@/components/ui-ext/progress-bar";
import { Reveal } from "@/components/ui-ext/reveal";
import { matchBreakdown, skillsFound, skillsMissing, keywordGaps } from "@/lib/career-data";

export const Route = createFileRoute("/_dash/match")({
  head: () => ({ meta: [{ title: "Match Analysis — CareerPilot AI" }] }),
  component: MatchPage,
});

function MatchPage() {
  return (
    <>
      <PageHeader
        title="Match Analysis"
        subtitle="How well your resume aligns with the target role."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal>
          <GlassCard hover={false} glow="primary" className="flex h-full flex-col items-center justify-center text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Overall Match
            </h3>
            <div className="my-4">
              <ScoreGauge value={78} size={210} title="Good Fit" />
            </div>
            <p className="text-sm text-muted-foreground">Strong alignment — close a few gaps to reach 90+.</p>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-2">
          <GlassCard hover={false} className="h-full">
            <h3 className="mb-6 font-semibold">Match Breakdown</h3>
            <div className="space-y-6">
              {matchBreakdown.map((m, i) => (
                <ProgressBar key={m.label} label={m.label} value={m.value} color={m.color} delay={i * 0.1} />
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <GlassCard hover={false} glow="success" className="h-full">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h3 className="font-semibold">Skills Found</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsFound.map((s) => (
                <span key={s} className="rounded-full bg-success/15 px-3 py-1.5 text-sm font-medium text-success">
                  {s}
                </span>
              ))}
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard hover={false} className="h-full">
            <div className="mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold">Missing Skills & Keyword Gaps</h3>
            </div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Missing Skills</p>
            <div className="mb-5 flex flex-wrap gap-2">
              {skillsMissing.map((s) => (
                <span key={s} className="rounded-full bg-destructive/15 px-3 py-1.5 text-sm font-medium text-destructive">
                  {s}
                </span>
              ))}
            </div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Keyword Gaps</p>
            <div className="flex flex-wrap gap-2">
              {keywordGaps.map((s) => (
                <span key={s} className="rounded-full bg-warning/15 px-3 py-1.5 text-sm font-medium text-warning">
                  {s}
                </span>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </>
  );
}
