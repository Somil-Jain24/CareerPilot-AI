import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Loader2, Lock, FileText, ArrowRight, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { ScoreGauge } from "@/components/ui-ext/score-gauge";
import { ProgressBar } from "@/components/ui-ext/progress-bar";
import { Reveal } from "@/components/ui-ext/reveal";
import { analyzeJobMatchFn } from "@/lib/api/ai.functions";
import { useMetricsStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/match")({
  head: () => ({ meta: [{ title: "Match Analysis — CareerPilot AI" }] }),
  component: MatchPage,
});

interface MatchResult {
  matchScore: number;
  matchBreakdown: { label: string; value: number; color: string }[];
  skillsFound: string[];
  skillsMissing: string[];
  keywordGaps: string[];
  recommendations: string[];
}

function MatchPage() {
  const resumeText = useMetricsStore((s) => s.resumeText);
  const jobDescription = useMetricsStore((s) => s.jobDescription);
  const setResumeData = useMetricsStore((s) => s.setResumeData);

  const hasResume = resumeText.trim().length > 0;

  const [localJD, setLocalJD] = useState(jobDescription);
  const [data, setData] = useState<MatchResult | null>(null);
  
  // Initialize loading to true if we're going to auto-run on mount
  const [loading, setLoading] = useState(hasResume && jobDescription.trim().length > 0);

  // Auto-run when resume + JD are both available
  useEffect(() => {
    if (!hasResume || !jobDescription.trim() || data) {
      if (loading && (!hasResume || !jobDescription.trim() || data)) {
        setLoading(false);
      }
      return;
    }
    runAnalysis(resumeText, jobDescription);
  }, [hasResume]);

  const runAnalysis = async (text: string, jd: string) => {
    setLoading(true);
    try {
      const res = await analyzeJobMatchFn({ data: { resumeText: text, jobDescription: jd } }) as MatchResult;
      setData(res);
      toast.success("Match analysis complete");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to analyze job match. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualAnalyze = () => {
    const jd = localJD.trim();
    if (!jd) {
      toast.error("Please paste a job description");
      return;
    }
    setResumeData(resumeText, jd);
    runAnalysis(resumeText, jd);
  };

  // ── Locked state ───────────────────────────────────────────────────────────
  if (!hasResume) {
    return (
      <>
        <PageHeader
          title="Match Analysis"
          subtitle="How well your resume aligns with the target role."
        />
        <Reveal>
          <GlassCard hover={false} className="flex flex-col items-center justify-center py-20 text-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30 border border-border">
              <Lock className="h-9 w-9 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">No Resume Uploaded</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Upload your resume on the Resume Analyzer page first. Your match report will be generated automatically.
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

  // ── No JD yet or Editing JD ────────────────────────────────────────────────
  if (!data && !loading) {
    return (
      <>
        <PageHeader
          title="Match Analysis"
          subtitle="How well your resume aligns with the target role."
        />
        <Reveal>
          <GlassCard hover={false} className="max-w-2xl mx-auto">
            {!jobDescription.trim() && (
              <div className="flex items-start gap-3 mb-4 rounded-xl bg-warning/10 border border-warning/20 p-3.5">
                <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <p className="text-sm text-warning">
                  No job description was provided during resume upload. Paste one below to run the match analysis.
                </p>
              </div>
            )}
            <h3 className="mb-2 font-semibold">Job Description</h3>
            <textarea
              className="h-52 w-full rounded-xl border border-border bg-muted/20 p-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Paste the job description here…"
              value={localJD}
              onChange={(e) => setLocalJD(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleManualAnalyze}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
              >
                Analyze Match
              </button>
            </div>
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
          title="Match Analysis"
          subtitle="How well your resume aligns with the target role."
        />
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-slate-200">Running Match Analysis</h3>
            <p className="text-sm text-muted-foreground mt-1">Comparing your resume against the job description…</p>
          </div>
        </div>
      </>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  return (
    <>
      <PageHeader
        title="Match Analysis"
        subtitle="How well your resume aligns with the target role."
        action={
          data ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setLocalJD(jobDescription); setData(null); }}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                <FileText className="h-4 w-4" /> Edit JD
              </button>
              <button
                onClick={() => { runAnalysis(resumeText, jobDescription); }}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                <Loader2 className="h-4 w-4" /> Re-analyze
              </button>
            </div>
          ) : undefined
        }
      />

      {data && (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal>
              <GlassCard hover={false} glow="primary" className="flex h-full flex-col items-center justify-center text-center">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Overall Match
                </h3>
                <div className="my-4">
                  <ScoreGauge
                    value={data.matchScore}
                    size={210}
                    title={data.matchScore > 80 ? "Great Fit" : data.matchScore > 60 ? "Good Fit" : "Needs Work"}
                  />
                </div>
                <p className="text-sm text-muted-foreground">AI computed alignment based on JD.</p>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-2">
              <GlassCard hover={false} className="h-full">
                <h3 className="mb-6 font-semibold">Match Breakdown</h3>
                <div className="space-y-6">
                  {data.matchBreakdown?.map((m, i) => (
                    <ProgressBar key={m.label} label={m.label} value={m.value} color={m.color} delay={i * 0.1} />
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <Reveal>
              <GlassCard hover={false} glow="success" className="h-full">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <h3 className="font-semibold">Skills Found</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skillsFound?.map((s) => (
                    <span key={s} className="rounded-full bg-success/15 px-3 py-1.5 text-sm font-medium text-success">
                      {s}
                    </span>
                  ))}
                </div>

                {data.recommendations && data.recommendations.length > 0 && (
                  <div className="mt-6 border-t border-border/50 pt-4">
                    <h3 className="font-semibold text-sm mb-2 text-primary">AI Recommendations</h3>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                      {data.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
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
                  {data.skillsMissing?.map((s) => (
                    <span key={s} className="rounded-full bg-destructive/15 px-3 py-1.5 text-sm font-medium text-destructive">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Keyword Gaps</p>
                <div className="flex flex-wrap gap-2">
                  {data.keywordGaps?.map((s) => (
                    <span key={s} className="rounded-full bg-warning/15 px-3 py-1.5 text-sm font-medium text-warning">
                      {s}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </>
      )}
    </>
  );
}
