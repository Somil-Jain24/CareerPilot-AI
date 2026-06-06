import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Target, FolderGit2, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { roadmap } from "@/lib/career-data";

export const Route = createFileRoute("/_dash/roadmap")({
  head: () => ({ meta: [{ title: "Skill Gap Roadmap — CareerPilot AI" }] }),
  component: RoadmapPage,
});

function RoadmapPage() {
  return (
    <>
      <PageHeader
        title="Skill Gap Roadmap"
        subtitle="A 4-week plan to close the gaps between you and the role."
      />

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-4 top-2 bottom-2 hidden w-px bg-gradient-to-b from-primary via-secondary to-success md:block" />
        <div className="space-y-6">
          {roadmap.map((w, i) => (
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
      </div>
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
