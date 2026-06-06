import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Target, FolderGit2, Check } from "lucide-react";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { useAnalysis } from "@/context/AnalysisContext";
import { roadmap as defaultRoadmap } from "@/lib/career-data";

export const Route = createFileRoute("/_dash/roadmap")({
  head: () => ({ meta: [{ title: "Skill Gap Roadmap — CareerPilot AI" }] }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const { analysis, updateRoadmapProgress } = useAnalysis();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("roadmapProgress");
    return saved ? JSON.parse(saved) : {};
  });

  const roadmap = analysis?.roadmapTopics || defaultRoadmap;

  const toggleItem = (week: string, item: string) => {
    const key = `${week}-${item}`;
    const newState = !checkedItems[key];
    setCheckedItems((prev) => ({ ...prev, [key]: newState }));
    updateRoadmapProgress(week, item, newState);
  };

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
                  <Block icon={BookOpen} title="Topics" items={w.topics} week={w.week} accent="text-primary" onToggle={toggleItem} checkedItems={checkedItems} />
                  <Block icon={Target} title="Learning Goals" items={w.goals} week={w.week} accent="text-secondary" onToggle={toggleItem} checkedItems={checkedItems} />
                  <Block icon={FolderGit2} title="Projects" items={w.projects} week={w.week} accent="text-success" onToggle={toggleItem} checkedItems={checkedItems} />
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
  week,
  accent,
  onToggle,
  checkedItems,
}: {
  icon: typeof BookOpen;
  title: string;
  items: string[];
  week: string;
  accent: string;
  onToggle: (week: string, item: string) => void;
  checkedItems: Record<string, boolean>;
}) {
  return (
    <div className="rounded-xl bg-muted/25 p-4">
      <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${accent}`}>
        <Icon className="h-4 w-4" /> {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((it) => {
          const key = `${week}-${it}`;
          const isChecked = checkedItems[key];
          return (
            <li key={it} className="flex items-start gap-2 text-sm">
              <button
                onClick={() => onToggle(week, it)}
                className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-sm border transition-all ${
                  isChecked
                    ? "border-success bg-success text-success-foreground"
                    : "border-muted-foreground/60 text-transparent"
                }`}
              >
                {isChecked && <Check className="h-3.5 w-3.5" />}
              </button>
              <span className={isChecked ? "line-through text-muted-foreground/60" : "text-muted-foreground"}>
                {it}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
