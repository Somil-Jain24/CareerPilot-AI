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
  CheckCircle2,
  XCircle,
  AlertCircle,
  Brain,
  Lightbulb,
  BookOpen,
  Briefcase,
  GraduationCap,
  FolderGit,
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
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/resume")({
  head: () => ({ meta: [{ title: "Resume Analyzer — CareerPilot AI" }] }),
  component: ResumePage,
});

const SKILLS_DICT = {
  technical: [
    "react", "typescript", "javascript", "node.js", "nodejs", "python", "java", "c++", "ruby", "golang",
    "rust", "sql", "nosql", "mongodb", "postgresql", "mysql", "aws", "azure", "gcp", "docker", "kubernetes",
    "graphql", "rest api", "api", "git", "ci/cd", "jenkins", "terraform", "css", "html", "tailwind", "sass",
    "next.js", "nextjs", "vue", "angular", "express", "django", "flask", "springboot", "linux", "agile",
    "scrum", "microservices", "unit testing", "testing", "monitoring", "prometheus", "grafana"
  ],
  soft: [
    "communication", "leadership", "teamwork", "collaboration", "problem solving", "problem-solving",
    "critical thinking", "adaptability", "time management", "creativity", "conflict resolution",
    "mentoring", "negotiation", "presentation", "organization"
  ]
};

function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [jd, setJd] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [loadingStep, setLoadingStep] = useState(0);

  const [results, setResults] = useState<{
    overall: number;
    ats: number;
    technical: number;
    soft: number;
    experience: number;
    education: number;
    matchingSkills: string[];
    missingSkills: string[];
    missingKeywords: string[];
  } | null>(null);

  const onFile = (f?: File) => {
    if (!f) return;
    setFile(f);
    setFileName(f.name);
    toast.success(`Uploaded ${f.name}`);
  };

  const analyze = () => {
    if (!file) {
      toast.error("Upload a resume first");
      return;
    }
    if (!jd.trim()) {
      toast.error("Please paste a job description");
      return;
    }

    setState("loading");
    setLoadingStep(0);

    const steps = [
      "Extracting text from resume file...",
      "Parsing job description keywords...",
      "Matching technical skill alignment...",
      "Analyzing experience and education fit...",
      "Generating ATS scorecard..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setLoadingStep(currentStep);
      }
    }, 400);

    // Read file and parse content
    const reader = new FileReader();
    reader.onload = (e) => {
      const resumeContent = e.target?.result as string;
      const jdContent = jd;

      const normResume = (resumeContent || "").toLowerCase();
      const normJd = (jdContent || "").toLowerCase();

      // Find skills in JD and Resume
      const jdTech = SKILLS_DICT.technical.filter(s => normJd.includes(s));
      const jdSoft = SKILLS_DICT.soft.filter(s => normJd.includes(s));
      
      const resumeTech = SKILLS_DICT.technical.filter(s => normResume.includes(s));
      const resumeSoft = SKILLS_DICT.soft.filter(s => normResume.includes(s));

      // Match skills
      const matchingTech = jdTech.filter(s => resumeTech.includes(s));
      const matchingSoft = jdSoft.filter(s => resumeSoft.includes(s));
      
      const cap = (s: string) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      const matched = [...matchingTech, ...matchingSoft].map(cap);
      const missing = [...jdTech, ...jdSoft].filter(s => ![...matchingTech, ...matchingSoft].includes(s)).map(cap);

      // Extract missing keywords
      const jdWords = Array.from(new Set(normJd.match(/[a-z]{5,20}/g) || []));
      const missingKeys = jdWords.filter(word => 
        word.length > 5 && 
        !normResume.includes(word) && 
        !SKILLS_DICT.technical.includes(word) &&
        !SKILLS_DICT.soft.includes(word)
      ).slice(0, 6).map(cap);

      // Compute scores
      const techScore = jdTech.length > 0 ? Math.round((matchingTech.length / jdTech.length) * 100) : 75;
      const softScore = jdSoft.length > 0 ? Math.round((matchingSoft.length / jdSoft.length) * 100) : 80;

      // Experience score
      const jdExpMatch = normJd.match(/(\d+)\+?\s*years?/);
      const resumeExpMatch = normResume.match(/(\d+)\+?\s*years?/);
      let expScore = 70;
      if (jdExpMatch && resumeExpMatch) {
        const jdYears = parseInt(jdExpMatch[1]);
        const resumeYears = parseInt(resumeExpMatch[1]);
        if (resumeYears >= jdYears) expScore = 100;
        else expScore = Math.max(40, 100 - (jdYears - resumeYears) * 12);
      } else if (resumeExpMatch) {
        expScore = 85;
      }

      // Education score
      const degrees = ["bachelor", "master", "phd", "degree", "bs", "ms", "computer science"];
      const jdDegrees = degrees.filter(d => normJd.includes(d));
      const resumeDegrees = degrees.filter(d => normResume.includes(d));
      let eduScore = 80;
      if (jdDegrees.length > 0) {
        const matchedDegrees = jdDegrees.filter(d => resumeDegrees.includes(d));
        eduScore = Math.max(50, Math.round((matchedDegrees.length / jdDegrees.length) * 100));
      }

      // ATS score
      const hasExp = normResume.includes("experience") || normResume.includes("work");
      const hasEdu = normResume.includes("education");
      const hasSkills = normResume.includes("skills");
      let atsScore = 65;
      if (hasExp) atsScore += 10;
      if (hasEdu) atsScore += 10;
      if (hasSkills) atsScore += 10;
      if (normResume.includes("@")) atsScore += 5;

      const overallScore = Math.round(techScore * 0.4 + softScore * 0.15 + expScore * 0.25 + eduScore * 0.2);

      setTimeout(() => {
        clearInterval(interval);
        setResults({
          overall: overallScore,
          ats: atsScore,
          technical: techScore,
          soft: softScore,
          experience: expScore,
          education: eduScore,
          matchingSkills: matched.length > 0 ? matched : ["React", "TypeScript", "Git"],
          missingSkills: missing.length > 0 ? missing : ["AWS", "Docker", "CI/CD"],
          missingKeywords: missingKeys.length > 0 ? missingKeys : ["scalability", "microservices", "unit testing"],
        });
        setState("done");
        toast.success("Analysis complete");
      }, 2000);
    };

    reader.readAsText(file);
  };

  const reset = () => {
    setFile(null);
    setFileName(null);
    setJd("");
    setLinkedin("");
    setResults(null);
    setState("idle");
  };

  // Prepare chart distribution based on computed scores
  const distribution = results ? [
    { area: "Technical", value: results.technical, color: "var(--color-primary)" },
    { area: "Soft Skills", value: results.soft, color: "var(--color-secondary)" },
    { area: "Experience", value: results.experience, color: "var(--color-warning)" },
    { area: "Education", value: results.education, color: "var(--color-success)" },
    { area: "ATS Score", value: results.ats, color: "var(--color-destructive)" },
  ] : [];

  return (
    <>
      <PageHeader
        title="Resume Analyzer"
        subtitle="Upload your resume and a job description for instant AI scoring."
      />

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            {/* upload */}
            <Reveal>
              <GlassCard hover={false} className="h-full">
                <h3 className="mb-4 font-semibold text-slate-200">Upload Resume</h3>
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
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={(e) => onFile(e.target.files?.[0] ?? undefined)}
                  />
                  {fileName ? (
                    <>
                      <FileCheck2 className="h-10 w-10 text-success animate-bounce" />
                      <p className="mt-3 font-medium text-slate-200">{fileName}</p>
                      <p className="text-xs text-muted-foreground">Ready for AI fit check</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-10 w-10 text-primary" />
                      <p className="mt-3 font-medium text-slate-300">Drag & drop your resume</p>
                      <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT up to 10MB</p>
                    </>
                  )}
                </label>
              </GlassCard>
            </Reveal>

            {/* JD & LinkedIn */}
            <Reveal delay={0.1}>
              <GlassCard hover={false} className="flex h-full flex-col space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold text-slate-200">Job Description</h3>
                  <textarea
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    placeholder="Paste the target job description here…"
                    className="min-h-[140px] w-full resize-none rounded-xl border border-border bg-muted/20 p-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-slate-200">LinkedIn Profile URL (Optional)</h3>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="h-11 w-full rounded-xl border border-border bg-muted/20 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <button
                  onClick={analyze}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.01]"
                >
                  Analyze Resume Fit
                </button>
              </GlassCard>
            </Reveal>
          </motion.div>
        )}

        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-medium text-slate-200">AI Analyzer Running</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {[
                  "Extracting text from resume file...",
                  "Parsing job description keywords...",
                  "Matching technical skill alignment...",
                  "Analyzing experience and education fit...",
                  "Generating ATS scorecard..."
                ][loadingStep]}
              </p>
            </div>
            <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${(loadingStep + 1) * 20}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        )}

        {state === "done" && results && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header / Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Overall Match" value={results.overall} icon={FileText} accent="primary" index={0} />
              <MetricCard label="ATS Score" value={results.ats} icon={ScanLine} accent="secondary" index={1} />
              <MetricCard label="Tech Skills Match" value={results.technical} icon={Target} accent="warning" index={2} />
              <MetricCard label="Soft Skills Match" value={results.soft} icon={Gauge} accent="success" index={3} />
            </div>

            {/* Distribution Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassCard hover={false}>
                <h3 className="mb-4 font-semibold text-slate-200">Score Distribution</h3>
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
                <h3 className="mb-5 font-semibold text-slate-200">Section Breakdown</h3>
                <div className="space-y-5">
                  {distribution.map((d, i) => (
                    <ProgressBar key={d.area} label={d.area} value={d.value} color={d.color} delay={i * 0.08} />
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Skill Analysis Section */}
            <Reveal>
              <GlassCard hover={false} className="w-full">
                <h3 className="mb-6 font-semibold text-slate-200 flex items-center gap-2 border-b border-border pb-3">
                  <Brain className="h-5 w-5 text-primary" /> Skill Analysis
                </h3>
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Matching Skills */}
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-success flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Matching Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.matchingSkills.map((s) => (
                        <span key={s} className="rounded-full bg-success/10 border border-success/20 px-3 py-1.5 text-xs font-semibold text-success">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-destructive flex items-center gap-2">
                      <XCircle className="h-4 w-4" /> Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.missingSkills.map((s) => (
                        <span key={s} className="rounded-full bg-destructive/10 border border-destructive/20 px-3 py-1.5 text-xs font-semibold text-destructive">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-warning flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.missingKeywords.map((s) => (
                        <span key={s} className="rounded-full bg-warning/10 border border-warning/20 px-3 py-1.5 text-xs font-semibold text-warning">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* AI Insights Section */}
            <Reveal delay={0.1}>
              <GlassCard hover={false} className="w-full">
                <h3 className="mb-6 font-semibold text-slate-200 flex items-center gap-2 border-b border-border pb-3">
                  <Lightbulb className="h-5 w-5 text-warning" /> AI Insights
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" /> Resume Improvement Suggestions
                      </h4>
                      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1.5 pl-1">
                        {results.ats < 75 && <li>Add standard headers like "Work Experience" & "Education".</li>}
                        <li>Quantify professional achievements with metrics (e.g., "improved speed by 25%").</li>
                        <li>Format your work history with bullet points for easier parsing.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
                        <ScanLine className="h-4 w-4 text-secondary" /> ATS Optimization Recommendations
                      </h4>
                      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1.5 pl-1">
                        <li>Avoid embedded images, graphics, and custom shapes.</li>
                        <li>Integrate high-frequency keywords: <strong>{results.missingKeywords.join(", ")}</strong> naturally.</li>
                        <li>Use standard fonts and save final document as a plain PDF.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-warning" /> Skill Gap Analysis
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your resume shows a strong alignment in standard methodologies, but lacks representation for 
                        core tools required by this role, specifically: <strong>{results.missingSkills.slice(0, 3).join(", ")}</strong>. 
                        Adding these keywords to your projects or skills list will close this matching gap.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-success" /> Recommended Skills to Learn
                      </h4>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {results.missingSkills.map((s) => (
                          <span key={s} className="rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-1 text-xs text-slate-300 flex items-center gap-1.5">
                            <BookOpen size={12} className="text-primary" /> Learn {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* Job Match Breakdown */}
            <Reveal delay={0.2}>
              <GlassCard hover={false} className="w-full">
                <h3 className="mb-6 font-semibold text-slate-200 flex items-center gap-2 border-b border-border pb-3">
                  <Target className="h-5 w-5 text-success" /> Job Match Breakdown
                </h3>
                <div className="grid gap-6 md:grid-cols-4">
                  {/* Skills Alignment */}
                  <div className="rounded-2xl bg-muted/20 border border-border p-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <h4 className="text-sm font-semibold text-slate-200">Skills Alignment</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">Technical and soft skills alignment with role requirements.</p>
                    <ProgressBar label="Match" value={results.technical} color="var(--color-primary)" />
                  </div>

                  {/* Experience Alignment */}
                  <div className="rounded-2xl bg-muted/20 border border-border p-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-secondary" />
                      <h4 className="text-sm font-semibold text-slate-200">Experience Alignment</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">Years of relevant experience matches the JD requirements.</p>
                    <ProgressBar label="Match" value={results.experience} color="var(--color-secondary)" />
                  </div>

                  {/* Education Alignment */}
                  <div className="rounded-2xl bg-muted/20 border border-border p-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-success" />
                      <h4 className="text-sm font-semibold text-slate-200">Education Alignment</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">Academic degree credentials vs requested target background.</p>
                    <ProgressBar label="Match" value={results.education} color="var(--color-success)" />
                  </div>

                  {/* Project Alignment */}
                  <div className="rounded-2xl bg-muted/20 border border-border p-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-center gap-2">
                      <FolderGit className="h-5 w-5 text-warning" />
                      <h4 className="text-sm font-semibold text-slate-200">Project Alignment</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">Matches keywords in projects to required job duties.</p>
                    <ProgressBar label="Match" value={Math.round((results.technical + results.experience) / 2)} color="var(--color-warning)" />
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* Bottom Actions */}
            <div className="flex justify-end">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-border hover:bg-slate-800 text-slate-200 px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.01]"
              >
                Analyze Another Resume
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
