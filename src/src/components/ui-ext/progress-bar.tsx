import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CountUp } from "./count-up";

interface ProgressBarProps {
  label: string;
  value: number;
  color?: string;
  delay?: number;
}

export function ProgressBar({ label, value, color, delay = 0 }: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">
          <CountUp to={value} suffix="%" />
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/60">
        <motion.div
          className={cn("h-full rounded-full")}
          style={{ background: color ?? "var(--gradient-primary)" }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.1, ease: "easeOut", delay }}
        />
      </div>
    </div>
  );
}
