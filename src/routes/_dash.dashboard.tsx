import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText, ScanLine, MessagesSquare, Target } from "lucide-react";
import { PageHeader } from "@/components/ui-ext/page-header";
import { MetricCard } from "@/components/ui-ext/metric-card";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { ScoreGauge } from "@/components/ui-ext/score-gauge";
import { ProgressBar } from "@/components/ui-ext/progress-bar";
import { Reveal } from "@/components/ui-ext/reveal";
import { scores, computeCRI, criHistory, scoreLabel } from "@/lib/career-data";

export const Route = createFileRoute("/_dash/dashboard")({
  head: () => ({ meta: [{ title: "Employability Dashboard — CareerPilot AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const cri = computeCRI();

  return (
    <>
      <PageHeader
        title="Employability Dashboard"
        subtitle="Your real-time Career Readiness Index and key metrics."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* CRI gauge */}
        <Reveal className="lg:col-span-1">
          <GlassCard hover={false} glow="primary" className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Career Readiness Index
            </h2>
            <div className="my-4">
              <ScoreGauge value={cri} size={220} title={scoreLabel(cri)} />
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Weighted from ATS (30%), Resume (25%), Interview (25%) & Skills (20%).
            </p>
          </GlassCard>
        </Reveal>

        {/* metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
          <MetricCard label="Resume Score" value={scores.resume} icon={FileText} accent="primary" delta="+3" index={0} />
          <MetricCard label="ATS Score" value={scores.ats} icon={ScanLine} accent="secondary" delta="+6" index={1} />
          <MetricCard label="Interview Readiness" value={scores.interview} icon={MessagesSquare} accent="success" delta="+4" index={2} />
          <MetricCard label="Skill Match" value={scores.skill} icon={Target} accent="warning" delta="+2" index={3} />
        </div>
      </div>

      {/* charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <GlassCard hover={false} className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">CRI Progress Over Time</h3>
              <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
                +28 in 6 months
              </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={criHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-foreground)",
                  }}
                />
                <Line type="monotone" dataKey="cri" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard hover={false} className="h-full">
            <h3 className="mb-4 font-semibold">Metric Evolution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={criHistory}>
                <defs>
                  <linearGradient id="gResume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gAts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Area type="monotone" dataKey="resume" stroke="var(--color-primary)" fill="url(#gResume)" strokeWidth={2} />
                <Area type="monotone" dataKey="ats" stroke="var(--color-secondary)" fill="url(#gAts)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </Reveal>
      </div>

      {/* progress */}
      <Reveal>
        <GlassCard hover={false}>
          <h3 className="mb-5 font-semibold">Activity & Coverage</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <ProgressBar label="Roadmap Completion" value={45} color="var(--color-primary)" />
            <ProgressBar label="Interview Practice Sessions" value={62} color="var(--color-secondary)" delay={0.1} />
            <ProgressBar label="Skill Coverage" value={68} color="var(--color-success)" delay={0.2} />
          </div>
        </GlassCard>
      </Reveal>
    </>
  );
}
