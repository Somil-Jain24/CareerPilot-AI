import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Youtube, GraduationCap, FileText, Terminal, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { Reveal } from "@/components/ui-ext/reveal";
import { cn } from "@/lib/utils";
import { fetchLearningResourcesFn } from "@/lib/api/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/resources")({
  head: () => ({ meta: [{ title: "Learning Hub — CareerPilot AI" }] }),
  component: ResourcesPage,
});

const filters = ["All", "YouTube", "Courses", "Documentation", "Practice Platforms"];

const typeIcon: Record<string, typeof Youtube> = {
  YouTube: Youtube,
  Courses: GraduationCap,
  Documentation: FileText,
  "Practice Platforms": Terminal,
};

const levelColor: Record<string, string> = {
  Beginner: "bg-success/15 text-success",
  Intermediate: "bg-warning/15 text-warning",
  Advanced: "bg-destructive/15 text-destructive",
};

function ResourcesPage() {
  const [skillsToLearn, setSkillsToLearn] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    resources: { title: string; desc: string; type: string; level: string; platform: string; skill: string }[];
  } | null>(null);

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const list = useMemo(
    () => {
      if (!data) return [];
      return data.resources.filter(
        (r) =>
          (filter === "All" || r.type === filter) &&
          (r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.skill.toLowerCase().includes(query.toLowerCase())),
      );
    },
    [filter, query, data],
  );

  const handleFetch = async () => {
    if (!skillsToLearn.trim()) {
      toast.error("Please provide skills to learn");
      return;
    }
    setLoading(true);
    try {
      const skillsArray = skillsToLearn.split(",").map(s => s.trim()).filter(Boolean);
      const res = await fetchLearningResourcesFn({ data: { skills: skillsArray } }) as any;
      setData(res);
      toast.success("Learning resources loaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch learning resources");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Learning Hub"
        subtitle="Curated resources to close your skill gaps fast."
      />

      {!data && (
        <Reveal>
          <GlassCard hover={false}>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="mb-2 font-semibold">Skills to Learn (comma separated)</h3>
                <input
                  type="text"
                  className="w-full rounded-xl border border-border bg-muted/20 p-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. React, Docker, GraphQL"
                  value={skillsToLearn}
                  onChange={(e) => setSkillsToLearn(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleFetch}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Find Resources
              </button>
            </div>
          </GlassCard>
        </Reveal>
      )}

      {data && (
        <>
          <GlassCard hover={false}>
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources or skills…"
                className="glass h-11 w-full rounded-xl pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all",
                    filter === f ? "bg-gradient-primary text-primary-foreground glow-ring" : "bg-muted/40 hover:bg-muted/60",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </GlassCard>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((r, i) => {
              const Icon = typeIcon[r.type] ?? FileText;
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="h-full">
                    <div className="flex items-start justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", levelColor[r.level] || "bg-muted text-muted-foreground")}>
                        {r.level}
                      </span>
                    </div>
                    <h3 className="mt-3 font-semibold leading-snug">{r.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{r.platform}</span>
                      <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-secondary">{r.skill}</span>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
          {list.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">No resources found.</p>
          )}
          
          <div className="mt-6 flex justify-end">
            <button onClick={() => setData(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50">
               Search Another
            </button>
          </div>
        </>
      )}
    </>
  );
}
