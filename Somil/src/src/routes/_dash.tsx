import { useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

export const Route = createFileRoute("/_dash")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <TopNavbar onMenu={() => setSidebarOpen(true)} />
        <main className="relative w-full px-4 py-6 lg:px-8 lg:py-8">
          {/* ambient glow */}
          <div className="pointer-events-none fixed inset-0 -z-10 bg-hero-glow opacity-40" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
