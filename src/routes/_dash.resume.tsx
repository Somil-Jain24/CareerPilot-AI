import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileCheck2,
  FileText,
  ScanLine,
  Target,
  Gauge,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { MetricCard } from "@/components/ui-ext/metric-card";
import { ProgressBar } from "@/components/ui-ext/progress-bar";
import { Reveal } from "@/components/ui-ext/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalysis } from "@/context/AnalysisContext";
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/resume")({
  head: () => ({ meta: [{ title: "Resume Analyzer — CareerPilot AI" }] }),
  component: ResumePage,
});

function ResumePage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [jd, setJd] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { analysis, updateAnalysis } = useAnalysis();

  const onFile = (f?: File) => {
    if (!f) return;
    setResumeFile(f);
    setFileName(f.name);
    toast.success(`Uploaded ${f.name}`);
  };

  const analyze = async () => {
    if (!resumeFile) {
      toast.error("Upload a resume first");
      return;
    }
    if (!jd.trim()) {
      toast.error("Paste a job description first");
      return;
    }
    setState("loading");
    try {
      await updateAnalysis(resumeFile, jd);
      setState("done");
      toast.success("Analysis complete");
    } catch (error) {
      toast.error("Analysis failed");
      setState("idle");
    }
  };

  // Use dynamic data from analysis or fallback
  const distribution = analysis
    ? [
        { area: "Skills Match", value: analysis.scores.skill, color: "var(--color-primary)" },
        { area: "Resume Quality", value: analysis.scores.resume, color: "var(--color-secondary)" },
        { area: "ATS Compatible", value: analysis.scores.ats, color: "var(--color-warning)" },
        { area: "Interview Ready", value: analysis.scores.interview, color: "var(--color-success)" },
      ]
    : [];

  return (
    <>
      <PageHeader
        title="Resume Analyzer"
        subtitle="Upload your resume and a job description for instant AI scoring."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* upload */}
        <Reveal>
          <GlassCard hover={false} className="h-full">
            <h3 className="mb-4 font-semibold">Upload Resume</h3>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onFile(e.dataTransfer.files?.[0]);
              }}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-6 py-12 text-center transition-colors hover:border-primary/60 hover:bg-primary/5"
            >
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? undefined)}
              />
              {fileName ? (
                <>
                  <FileCheck2 className="h-10 w-10 text-success" />
                  <p className="mt-3 font-medium">{fileName}</p>
                  <p className="text-xs text-muted-foreground">Ready · 248 KB</p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-primary" />
                  <p className="mt-3 font-medium">Drag & drop your resume</p>
                  <p className="text-xs text-muted-foreground">PDF or DOCX, up to 10MB</p>
                </>
              )}
            </label>
          </GlassCard>
        </Reveal>

        {/* JD */}
        <Reveal delay={0.1}>
          <GlassCard hover={false} className="flex h-full flex-col">
            <h3 className="mb-4 font-semibold">Job Description</h3>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description you're targeting…"
              className="min-h-[180px] flex-1 resize-none rounded-xl border border-border bg-muted/20 p-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={analyze}
              disabled={state === "loading"}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              {state === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
                </>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </GlassCard>
        </Reveal>
      </div>

      {/* results */}
      <AnimatePresence mode="wait">
        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </motion.div>
        )}

        {state === "done" && analysis && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Resume Score" value={analysis.scores.resume} icon={FileText} accent="primary" index={0} />
              <MetricCard label="ATS Score" value={analysis.scores.ats} icon={ScanLine} accent="secondary" index={1} />
              <MetricCard label="Skill Match" value={analysis.scores.skill} icon={Target} accent="warning" index={2} />
              <MetricCard label="Career Readiness" value={Math.round(0.3 * analysis.scores.ats + 0.25 * analysis.scores.resume + 0.25 * analysis.scores.interview + 0.2 * analysis.scores.skill)} icon={Gauge} accent="success" index={3} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <GlassCard hover={false}>
                <h3 className="mb-4 font-semibold">Score Distribution</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={distribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="area" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      cursor={{ fill: "var(--color-muted)", opacity: 0.2 }}
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {distribution.map((d) => (
                        <Cell key={d.area} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="mb-5 font-semibold">Section Breakdown</h3>
                <div className="space-y-5">
                  {distribution.map((d, i) => (
                    <ProgressBar key={d.area} label={d.area} value={d.value} color={d.color} delay={i * 0.08} />
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
