import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { ScoreGauge } from "@/components/ui-ext/score-gauge";
import { Reveal } from "@/components/ui-ext/reveal";
import { atsIssues, atsCompliant, skillsMissing, keywordDensity } from "@/lib/career-data";

export const Route = createFileRoute("/_dash/ats")({
  head: () => ({ meta: [{ title: "ATS Analyzer — CareerPilot AI" }] }),
  component: AtsPage,
});

function AtsPage() {
  return (
    <>
      <PageHeader
        title="ATS Analyzer"
        subtitle="Make sure applicant tracking systems can read your resume."
      />

      <Reveal>
        <GlassCard hover={false} glow="secondary" className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div>
            <h3 className="font-semibold">ATS Compatibility Score</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Your resume is mostly parser-friendly. Fix the flagged formatting issues to clear 90%.
            </p>
          </div>
          <ScoreGauge value={76} size={170} title="Compatible" />
        </GlassCard>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <GlassCard hover={false} className="h-full">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h3 className="font-semibold">Formatting Issues</h3>
            </div>
            <div className="space-y-3">
              {atsIssues.map((issue) => (
                <div
                  key={issue.title}
                  className={`rounded-xl border p-3.5 ${
                    issue.severity === "error"
                      ? "border-destructive/30 bg-destructive/10"
                      : "border-warning/30 bg-warning/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {issue.severity === "error" ? (
                      <XCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                    <p className="text-sm font-medium">{issue.title}</p>
                  </div>
                  <p className="mt-1 pl-6 text-xs text-muted-foreground">{issue.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h3 className="font-semibold">Resume Structure (Compliant)</h3>
            </div>
            <div className="mt-3 space-y-3">
              {atsCompliant.map((c) => (
                <div key={c.title} className="rounded-xl border border-success/30 bg-success/10 p-3.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <p className="text-sm font-medium">{c.title}</p>
                  </div>
                  <p className="mt-1 pl-6 text-xs text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard hover={false} className="h-full">
            <h3 className="mb-4 font-semibold">Missing Keywords</h3>
            <div className="mb-6 flex flex-wrap gap-2">
              {skillsMissing.map((s) => (
                <span key={s} className="rounded-full bg-destructive/15 px-3 py-1.5 text-sm font-medium text-destructive">
                  {s}
                </span>
              ))}
            </div>
            <h3 className="mb-4 font-semibold">Keyword Density</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart layout="vertical" data={keywordDensity}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="keyword" stroke="var(--color-muted-foreground)" fontSize={12} width={80} />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)", opacity: 0.2 }}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--color-secondary)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </Reveal>
      </div>
    </>
  );
}
