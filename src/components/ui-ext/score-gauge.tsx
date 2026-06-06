import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CountUp } from "./count-up";
import { scoreColor, scoreLabel } from "@/lib/career-data";

interface ScoreGaugeProps {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
  showLabel?: boolean;
  title?: string;
}

export function ScoreGauge({
  value,
  size = 200,
  thickness = 14,
  showLabel = true,
  title,
}: ScoreGaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = scoreColor(value);
  const offset = circumference - (value / 100) * circumference;

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={thickness}
          opacity={0.4}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-4xl font-bold" style={{ color }}>
          <CountUp to={value} />
        </span>
        {showLabel && (
          <span className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title ?? scoreLabel(value)}
          </span>
        )}
      </div>
    </div>
  );
}
