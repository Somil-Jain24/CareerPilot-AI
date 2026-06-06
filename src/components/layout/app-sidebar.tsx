import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plane, X, Crown } from "lucide-react";
import { navSections } from "./nav-items";
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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-100 bg-[#f8fafc]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 shadow-md">
              <Plane className="h-6 w-6 text-white transform -rotate-12" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-slate-900 leading-tight">
                CareerPilot<span className="text-indigo-600"> AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
                Your AI Career Growth Partner
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-none">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <h3 className="text-[10px] font-bold text-slate-400 tracking-wider px-3 uppercase">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={cn(
                        "group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                        active
                          ? "text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <item.icon className={cn(
                        "relative z-10 h-5 w-5 shrink-0 transition-colors",
                        active ? "text-white" : "text-slate-500 group-hover:text-slate-900"
                      )} />
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Upgrade to Pro Card */}
        <div className="m-4 rounded-2xl bg-violet-50/40 border border-violet-100/50 p-4 shrink-0">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-violet-600 fill-violet-200" />
            <p className="text-xs font-bold text-slate-900">Upgrade to Pro</p>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
            Unlimited analyses, AI coaching, premium resources & more.
          </p>
          <Link
            to="/pricing"
            onClick={onClose}
            className="mt-4 block w-full text-center rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
          >
            Go Pro
          </Link>
        </div>
      </aside>
    </>
  );
}
