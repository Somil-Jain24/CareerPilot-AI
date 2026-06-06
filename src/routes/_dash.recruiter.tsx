import { createFileRoute } from "@tanstack/react-router";
import { Check, X, Award, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { ScoreGauge } from "@/components/ui-ext/score-gauge";
import { Reveal } from "@/components/ui-ext/reveal";
import { useAnalysis } from "@/context/AnalysisContext";
import { recruiterStrengths as defaultStrengths, recruiterWeaknesses as defaultWeaknesses } from "@/lib/career-data";

export const Route = createFileRoute("/_dash/recruiter")({
  head: () => ({ meta: [{ title: "Recruiter View — CareerPilot AI" }] }),
  component: RecruiterPage,
});

function RecruiterPage() {
  const { analysis } = useAnalysis();

  const computeCRI = (scores = analysis?.scores) => {
    if (!scores) return 76;
    return Math.round(
      0.3 * scores.ats + 0.25 * scores.resume + 0.25 * scores.interview + 0.2 * scores.skill
    );
  };

  const cri = computeCRI();
  const fit = cri >= 71 ? "Strong Fit" : cri >= 41 ? "Moderate Fit" : "Weak Fit";
  const fitClass =
    cri >= 71 ? "bg-success/15 text-success" : cri >= 41 ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive";

  const recruiterStrengths = analysis?.recruiterStrengths || defaultStrengths;
  const recruiterWeaknesses = analysis?.recruiterWeaknesses || defaultWeaknesses;

  return (
    <>
      <PageHeader
        title="Recruiter View"
        subtitle="How a hiring team sees your candidate snapshot."
      />

      <Reveal>
        <GlassCard hover={false} glow="primary" className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-lg font-bold text-primary-foreground glow-ring">
              JD
            </span>
            <div>
              <h2 className="font-display text-xl font-bold">Candidate Snapshot</h2>
              <p className="text-sm text-muted-foreground">Jordan Dev · Full-Stack Engineer</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ScoreGauge value={cri} size={130} title="CRI" />
            <span className={`rounded-full px-4 py-2 text-sm font-bold ${fitClass}`}>{fit}</span>
          </div>
        </GlassCard>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <GlassCard hover={false} glow="success" className="h-full">
            <div className="mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-success" />
              <h3 className="font-semibold">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {recruiterStrengths.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard hover={false} className="h-full">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold">Weaknesses</h3>
            </div>
            <ul className="space-y-3">
              {recruiterWeaknesses.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                    <X className="h-3.5 w-3.5" />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </div>

      <Reveal>
        <GlassCard hover={false} className="text-center">
          <h3 className="font-semibold">Final Hiring Recommendation</h3>
          <span className={`mt-3 inline-block rounded-full px-6 py-2.5 text-lg font-bold ${fitClass}`}>
            {fit}
          </span>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            {analysis
              ? `Score: ${cri}/100. ${recruiterWeaknesses.length > 0 ? "Address: " + recruiterWeaknesses[0] + "." : "Strong candidate!"}`
              : "Upload your resume to see recruiter insights."}
          </p>
        </GlassCard>
      </Reveal>
    </>
  );
}
