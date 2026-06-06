import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { CountUp } from "./count-up";

interface MetricCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  accent?: "primary" | "secondary" | "success" | "warning";
  delta?: string;
  index?: number;
}

const accentText: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  warning: "text-warning",
};
const accentBg: Record<string, string> = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

export function MetricCard({
  label,
  value,
  suffix = "",
  icon: Icon,
  accent = "primary",
  delta,
  index = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
    >
      <GlassCard glow={accent === "warning" ? "primary" : accent} className="p-5">
        <div className="flex items-start justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", accentBg[accent])}>
            <Icon className="h-4.5 w-4.5" />
          </span>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className={cn("font-display text-3xl font-bold", accentText[accent])}>
            <CountUp to={value} suffix={suffix} />
          </span>
          {delta && <span className="mb-1 text-xs font-medium text-success">{delta}</span>}
        </div>
      </GlassCard>
    </motion.div>
  );
}
