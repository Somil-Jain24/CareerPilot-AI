import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  glow?: "primary" | "secondary" | "success" | "none";
  hover?: boolean;
  children?: ReactNode;
}

const glowMap: Record<string, string> = {
  primary: "before:bg-[radial-gradient(closest-side,var(--glow-primary),transparent)]",
  secondary: "before:bg-[radial-gradient(closest-side,var(--glow-secondary),transparent)]",
  success: "before:bg-[radial-gradient(closest-side,var(--glow-success),transparent)]",
  none: "",
};

export function GlassCard({
  className,
  children,
  glow = "none",
  hover = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={cn(
        "glass relative overflow-hidden rounded-2xl p-6",
        glow !== "none" &&
          "before:pointer-events-none before:absolute before:-right-10 before:-top-10 before:h-40 before:w-40 before:opacity-60 before:blur-2xl",
        glow !== "none" && glowMap[glow],
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
