import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, XCircle, Loader2, Lock, FileText, ArrowRight } from "lucide-react";
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
import { analyzeATSFn } from "@/lib/api/ai.functions";
import { useMetricsStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/ats")({
  head: () => ({ meta: [{ title: "ATS Analyzer — CareerPilot AI" }] }),
  component: AtsPage,
});

interface AtsResult {
  atsScore: number;
  atsIssues: { title: string; desc: string; severity: "error" | "warning" }[];
  atsCompliant: { title: string; desc: string }[];
  keywordGaps: string[];
  keywordDensity: { keyword: string; count: number }[];
}

function AtsPage() {
  const resumeText = useMetricsStore((s) => s.resumeText);
  const jobDescription = useMetricsStore((s) => s.jobDescription);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AtsResult | null>(null);
  const hasResume = resumeText.trim().length > 0;

  // Auto-run analysis as soon as the page loads if resume is available
  useEffect(() => {
    if (!hasResume || data) return;
    runAnalysis(resumeText, jobDescription);
  }, [hasResume]);

  const runAnalysis = async (text: string, jd: string) => {
    setLoading(true);
    try {
      const res = await analyzeATSFn({ data: { resumeText: text, jobDescription: jd || undefined } }) as AtsResult;
      setData(res);
      toast.success("ATS Analysis complete");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to analyze ATS compatibility. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  // ── Locked state — no resume uploaded yet ─────────────────────────────────
  if (!hasResume) {
    return (
      <>
        <PageHeader
          title="ATS Analyzer"
          subtitle="Make sure applicant tracking systems can read your resume."
        />
        <Reveal>
          <GlassCard hover={false} className="flex flex-col items-center justify-center py-20 text-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30 border border-border">
              <Lock className="h-9 w-9 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">No Resume Uploaded</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Upload your resume on the Resume Analyzer page first. Your ATS report will be generated automatically.
              </p>
            </div>
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.03]"
            >
              <FileText className="h-4 w-4" /> Go to Resume Analyzer <ArrowRight className="h-4 w-4" />
            </Link>
          </GlassCard>
        </Reveal>
      </>
    );
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <PageHeader
          title="ATS Analyzer"
          subtitle="Make sure applicant tracking systems can read your resume."
        />
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-slate-200">Running ATS Analysis</h3>
            <p className="text-sm text-muted-foreground mt-1">Checking parser compatibility and keyword coverage…</p>
          </div>
        </div>
      </>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  return (
    <>
      <PageHeader
        title="ATS Analyzer"
        subtitle="Make sure applicant tracking systems can read your resume."
        action={
          data ? (
            <button
              onClick={() => { setData(null); runAnalysis(resumeText, jobDescription); }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <Loader2 className="h-4 w-4" /> Re-analyze
            </button>
          ) : undefined
        }
      />

      {data && (
        <>
          <Reveal>
            <GlassCard hover={false} glow="secondary" className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div>
                <h3 className="font-semibold">ATS Compatibility Score</h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  {data.atsScore >= 80
                    ? "Your resume is highly ATS-friendly. Minor tweaks can push it higher."
                    : data.atsScore >= 60
                    ? "Your resume is mostly parser-friendly. Fix the flagged issues to clear 80%."
                    : "Several issues detected. Address the formatting problems below to improve your score."}
                </p>
                {jobDescription && (
                  <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    Analyzed against your job description
                  </p>
                )}
              </div>
              <ScoreGauge value={data.atsScore} size={170} title="Compatible" />
            </GlassCard>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <Reveal>
              <GlassCard hover={false} className="h-full">
                <div className="mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <h3 className="font-semibold">Formatting Issues</h3>
                </div>
                {data.atsIssues?.length > 0 ? (
                  <div className="space-y-3">
                    {data.atsIssues.map((issue, i) => (
                      <div
                        key={i}
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
                ) : (
                  <p className="text-sm text-muted-foreground">No formatting issues detected.</p>
                )}

                <div className="mt-5 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <h3 className="font-semibold">Resume Structure (Compliant)</h3>
                </div>
                <div className="mt-3 space-y-3">
                  {data.atsCompliant?.map((c, i) => (
                    <div key={i} className="rounded-xl border border-success/30 bg-success/10 p-3.5">
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
                {data.keywordGaps?.length > 0 ? (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {data.keywordGaps.map((s, i) => (
                      <span key={i} className="rounded-full bg-destructive/15 px-3 py-1.5 text-sm font-medium text-destructive">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mb-6 text-sm text-muted-foreground">No major keyword gaps detected.</p>
                )}

                <h3 className="mb-4 font-semibold">Keyword Density</h3>
                {data.keywordDensity?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart layout="vertical" data={data.keywordDensity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                      <YAxis type="category" dataKey="keyword" stroke="var(--color-muted-foreground)" fontSize={12} width={90} />
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
                ) : (
                  <p className="text-sm text-muted-foreground">No keyword data available.</p>
                )}
              </GlassCard>
            </Reveal>
          </div>
        </>
      )}
    </>
  );
}
