import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plane, X } from "lucide-react";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";

export function AppSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {/* mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary glow-ring">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-bold">
              CareerPilot<span className="text-primary"> AI</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "text-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-gradient-primary glow-ring"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className="relative z-10 h-4.5 w-4.5 shrink-0" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-2xl glass p-4">
          <p className="text-sm font-semibold">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Unlimited analyses & AI coaching.
          </p>
          <Link
            to="/pricing"
            onClick={onClose}
            className="mt-3 block w-full text-center rounded-lg bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground glow-ring hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Go Pro
          </Link>
        </div>
      </aside>
    </>
  );
}
