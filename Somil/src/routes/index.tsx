import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Plane,
  FileText,
  ScanLine,
  MessagesSquare,
  Target,
  PenLine,
  Map,
  ArrowRight,
  Upload,
  ClipboardPaste,
  Sparkles,
  TrendingUp,
  Star,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { CountUp } from "@/components/ui-ext/count-up";
import { Reveal } from "@/components/ui-ext/reveal";
import { testimonials } from "@/lib/career-data";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerPilot AI — Land Your Dream Job With AI" },
      {
        name: "description",
        content:
          "AI-powered resume analysis, ATS optimization, and interview preparation. Boost your employability with a personal AI career assistant.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: FileText, title: "Resume Analyzer", desc: "Deep AI scoring of structure, impact, and clarity.", accent: "primary" },
  { icon: ScanLine, title: "ATS Checker", desc: "Beat the bots with parser-friendly formatting.", accent: "secondary" },
  { icon: MessagesSquare, title: "Interview Coach", desc: "Mock interviews scored on 4 key attributes.", accent: "success" },
  { icon: Target, title: "Skill Gap Detector", desc: "Spot missing skills against any job description.", accent: "warning" },
  { icon: PenLine, title: "Cover Letter Generator", desc: "Tailored letters in your voice, instantly.", accent: "primary" },
  { icon: Map, title: "Career Roadmap", desc: "A week-by-week plan to close every gap.", accent: "secondary" },
];

const steps = [
  { icon: Upload, title: "Upload Resume", desc: "Drop your PDF or DOCX." },
  { icon: ClipboardPaste, title: "Paste Job Description", desc: "Target any role." },
  { icon: Sparkles, title: "Get AI Insights", desc: "Scores, gaps & fixes." },
  { icon: TrendingUp, title: "Improve Employability", desc: "Track your CRI rise." },
];

const accentBg: Record<string, string> = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

function Landing() {
  const { themeMode, setTheme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary glow-ring">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-bold">
              CareerPilot<span className="text-primary"> AI</span>
            </span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#testimonials" className="hover:text-foreground">Reviews</a>
          </nav>
          
          <div className="flex items-center gap-3.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-xl border border-border bg-muted/20 p-2.5 text-muted-foreground transition-all hover:bg-accent hover:text-foreground shadow-sm flex items-center justify-center"
                  aria-label="Select theme"
                >
                  {themeMode === "light" && <Sun className="h-5 w-5 text-warning animate-spin-slow" />}
                  {themeMode === "dark" && <Moon className="h-5 w-5 text-primary" />}
                  {themeMode === "system" && <Monitor className="h-5 w-5 text-slate-400" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 glass-strong">
                <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-warning" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-primary" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-slate-400" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/dashboard"
              className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.03]"
            >
              Launch App
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-glow" />
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 lg:px-8 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground"
              >
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
                Your Personal Employability Assistant
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-5 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl"
              >
                Land Your Dream Job <span className="text-gradient">With AI</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-5 max-w-lg text-lg text-muted-foreground"
              >
                Resume analysis, ATS optimization, and interview preparation — all in one
                intelligent dashboard that tracks your Career Readiness Index in real time.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link
                  to="/resume"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.03]"
                >
                  Analyze Resume
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/interview"
                  className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
                >
                  Start Interview Practice
                </Link>
              </motion.div>
            </div>

            {/* floating glass score cards */}
            <div className="relative h-[380px]">
              <FloatCard className="left-0 top-4" delay={0.2} label="Resume Score" value={82} accent="primary" icon={FileText} />
              <FloatCard className="right-2 top-24" delay={0.35} label="ATS Score" value={76} accent="secondary" icon={ScanLine} />
              <FloatCard className="left-10 bottom-2" delay={0.5} label="Interview Readiness" value={71} accent="success" icon={MessagesSquare} />
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Everything you need to get hired
          </h2>
          <p className="mt-3 text-muted-foreground">
            Six AI tools working together to maximize your employability.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <GlassCard glow={f.accent === "warning" ? "primary" : (f.accent as "primary")} className="h-full">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentBg[f.accent]}`}>
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-4 h-1 w-12 rounded-full bg-gradient-primary" />
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">Four steps from resume to offer.</p>
        </Reveal>
        <div className="relative mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="relative">
                <GlassCard hover={false} className="h-full text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary glow-ring">
                    <s.icon className="h-5 w-5 text-primary-foreground" />
                  </span>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-secondary">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </GlassCard>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* testimonials */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Loved by job seekers</h2>
          <p className="mt-3 text-muted-foreground">Real results from real candidates.</p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <GlassCard className="h-full">
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-foreground/90">“{t.quote}”</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <Reveal>
          <GlassCard hover={false} glow="primary" className="overflow-hidden p-10 text-center lg:p-16">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Ready to raise your <span className="text-gradient">Career Readiness Index?</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Join thousands of candidates landing interviews faster with CareerPilot AI.
            </p>
            <Link
              to="/dashboard"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.03]"
            >
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </GlassCard>
        </Reveal>
      </section>

      {/* footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-primary" />
            <span>© 2026 CareerPilot AI</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">About</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FloatCard({
  className,
  delay,
  label,
  value,
  accent,
  icon: Icon,
}: {
  className: string;
  delay: number;
  label: string;
  value: number;
  accent: "primary" | "secondary" | "success";
  icon: typeof FileText;
}) {
  const accentBgLocal: Record<string, string> = {
    primary: "bg-primary/15 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    success: "bg-success/15 text-success",
  };
  const accentText: Record<string, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute w-52 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="glass rounded-2xl p-5 glow-ring"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentBgLocal[accent]}`}>
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <div className={`mt-2 font-display text-4xl font-bold ${accentText[accent]}`}>
          <CountUp to={value} />
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
          <motion.div
            className="h-full rounded-full bg-gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1.4, delay: delay + 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
