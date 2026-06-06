import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Youtube, GraduationCap, FileText, Terminal } from "lucide-react";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { cn } from "@/lib/utils";
import { resources } from "@/lib/career-data";

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
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const list = useMemo(
    () =>
      resources.filter(
        (r) =>
          (filter === "All" || r.type === filter) &&
          (r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.skill.toLowerCase().includes(query.toLowerCase())),
      ),
    [filter, query],
  );

  return (
    <>
      <PageHeader
        title="Learning Hub"
        subtitle="Curated resources to close your skill gaps fast."
      />

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
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", levelColor[r.level])}>
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
    </>
  );
}
