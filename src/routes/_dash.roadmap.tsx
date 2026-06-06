import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Target, FolderGit2, CheckCircle2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { Reveal } from "@/components/ui-ext/reveal";
import { generateRoadmapFn } from "@/lib/api/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/roadmap")({
  head: () => ({ meta: [{ title: "Skill Gap Roadmap — CareerPilot AI" }] }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    roadmap: { week: string; title: string; topics: string[]; goals: string[]; projects: string[] }[];
  } | null>(null);

  const handleGenerate = async () => {
    if (!targetRole.trim() || !skills.trim()) {
      toast.error("Please provide your target role and missing skills");
      return;
    }
    setLoading(true);
    try {
      const skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
      const res = await generateRoadmapFn({ data: { careerGoal: targetRole, skillsMissing: skillsArray } }) as any;
      setData(res);
      toast.success("Roadmap generated");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to generate roadmap. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Skill Gap Roadmap"
        subtitle="A 4-week plan to close the gaps between you and the role."
      />

      {!data && (
        <Reveal>
          <GlassCard hover={false}>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Target Role</h3>
                <input
                  type="text"
                  className="w-full rounded-xl border border-border bg-muted/20 p-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Senior Frontend Developer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Missing Skills (comma separated)</h3>
                <input
                  type="text"
                  className="w-full rounded-xl border border-border bg-muted/20 p-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Docker, GraphQL, System Design"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Generate Roadmap
              </button>
            </div>
          </GlassCard>
        </Reveal>
      )}

      {data && (
        <div className="relative mt-6">
          <div className="absolute left-4 top-2 bottom-2 hidden w-px bg-gradient-to-b from-primary via-secondary to-success md:block" />
          <div className="space-y-6">
            {data.roadmap?.map((w, i) => (
              <motion.div
                key={w.week}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative md:pl-12"
              >
                <span className="absolute left-0 top-5 hidden h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground glow-ring md:flex">
                  {i + 1}
                </span>
                <GlassCard hover={false} glow={i === 0 ? "primary" : "none"}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wide text-secondary">{w.week}</span>
                      <h3 className="text-lg font-semibold">{w.title}</h3>
                    </div>
                    {i === 0 && (
                      <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
                        In Progress
                      </span>
                    )}
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <Block icon={BookOpen} title="Topics" items={w.topics} accent="text-primary" />
                    <Block icon={Target} title="Learning Goals" items={w.goals} accent="text-secondary" />
                    <Block icon={FolderGit2} title="Projects" items={w.projects} accent="text-success" />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button onClick={() => setData(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50">
               Generate Another
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Block({
  icon: Icon,
  title,
  items,
  accent,
}: {
  icon: typeof BookOpen;
  title: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="rounded-xl bg-muted/25 p-4">
      <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${accent}`}>
        <Icon className="h-4 w-4" /> {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
