import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, Star, Users, Award, Shield, Zap, Info, Calendar, Video, Play, Compass } from "lucide-react";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_dash/pricing")({
  head: () => ({ meta: [{ title: "Pricing & Plans — CareerPilot AI" }] }),
  component: PricingPage,
});

type BillingCycle = "monthly" | "yearly";
type PlanType = "individual" | "team";

function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const [planType, setPlanType] = useState<PlanType>("individual");

  // Pricing values based on cycle
  const prices = {
    free: 0,
    pro: billingCycle === "yearly" ? 17 : 20,
    max: billingCycle === "yearly" ? 85 : 100,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-12">
      {/* ── Page Header ───────────────────────────────── */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs text-primary font-medium"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Unlock Your Full Career Potential</span>
        </motion.div>
        
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Plans that grow with you
        </h1>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">
          Upgrade to get full ATS audits, mock sessions with voice coach, and upcoming live interviews with tech recruiters.
        </p>

        {/* Plan Type Selector */}
        <div className="inline-flex rounded-xl bg-muted/40 p-1 border border-border mt-4">
          <button
            onClick={() => setPlanType("individual")}
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-semibold transition-all",
              planType === "individual" ? "bg-sidebar shadow-md text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Individual
          </button>
          <button
            onClick={() => setPlanType("team")}
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-semibold transition-all",
              planType === "team" ? "bg-sidebar shadow-md text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Team and Enterprise
          </button>
        </div>
      </div>

      {/* ── Pricing Cards Grid ────────────────────────── */}
      {planType === "individual" ? (
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          
          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex"
          >
            <GlassCard hover={false} className="flex-1 flex flex-col p-8 border border-border hover:border-muted-foreground/30 transition-all rounded-3xl bg-card/10">
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/30 border border-border/50 text-muted-foreground">
                    <Compass className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Free</h3>
                    <p className="text-xs text-muted-foreground mt-1">Get started with basic analysis</p>
                  </div>
                  <div className="flex items-baseline text-foreground">
                    <span className="text-4xl font-extrabold tracking-tight">$0</span>
                  </div>
                </div>

                <button className="w-full rounded-2xl bg-muted/20 border border-border/80 px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/40 hover:scale-[1.01] active:scale-[0.99] transition-all">
                  Use CareerPilot for free
                </button>

                <div className="border-t border-border/60 pt-6">
                  <ul className="space-y-3.5 text-xs text-muted-foreground">
                    {[
                      "Chat on web, iOS, Android, and desktop",
                      "2 Resume analyses & ATS audits per month",
                      "AI Mock Interview (5 responses / session)",
                      "Basic Skill Roadmap & gap finder",
                      "Standard AI feedback speed",
                    ].map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 shrink-0 text-muted-foreground/80 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* PRO PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex"
          >
            <GlassCard hover={false} className="flex-1 flex flex-col p-8 border-2 border-primary/50 relative shadow-2xl shadow-primary/5 rounded-3xl bg-[#0B0F1A]/80 backdrop-blur-xl">
              {/* Popular Tag / Glow */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25">
                <Star className="h-3 w-3 fill-current" /> Most Popular
              </div>

              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 border border-primary/40 text-primary">
                      <Zap className="h-6 w-6" />
                    </div>

                    {/* Pro Toggle inside card as in screenshot */}
                    <div className="inline-flex rounded-lg bg-muted/40 p-0.5 border border-border">
                      <button
                        onClick={() => setBillingCycle("monthly")}
                        className={cn(
                          "rounded-md px-2 py-1 text-[10px] font-semibold transition-all",
                          billingCycle === "monthly" ? "bg-sidebar text-foreground shadow" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingCycle("yearly")}
                        className={cn(
                          "rounded-md px-2 py-1 text-[10px] font-semibold transition-all flex items-center gap-1",
                          billingCycle === "yearly" ? "bg-sidebar text-foreground shadow" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Yearly <span className="text-primary-foreground/90 font-bold bg-primary/80 rounded px-1 text-[8px] py-0.5">Save 17%</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      Pro
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Accelerate your search & prep</p>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-baseline text-foreground">
                      <span className="text-4xl font-extrabold tracking-tight">${prices.pro}</span>
                      <span className="ml-1.5 text-xs text-muted-foreground font-medium">USD / month</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {billingCycle === "yearly" ? "billed annually" : "billed monthly"}
                    </p>
                  </div>
                </div>

                <button className="w-full rounded-2xl bg-foreground text-background px-4 py-3 text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-lg hover:shadow-white/5">
                  Get Pro plan
                </button>

                <div className="border-t border-border/60 pt-6">
                  <p className="text-xs font-semibold text-foreground mb-3">Everything in Free and:</p>
                  <ul className="space-y-3.5 text-xs">
                    {[
                      "Unlimited Resume uploads, scoring & full ATS audits",
                      "Unlimited Voice-enabled AI Mock Interviews",
                      "Detailed coaching feedback with strengths & gap analyses",
                      "Priority AI speeds & response generation",
                      "Advanced LinkedIn profile optimizer checklist",
                    ].map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span className="text-foreground/90">{feat}</span>
                      </li>
                    ))}
                    
                    {/* Highlighted Upcoming features */}
                    {[
                      "Upcoming: Live mock sessions with industry experts",
                      "Upcoming: Premium custom cover letter tailoring",
                    ].map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-primary/5 rounded-lg p-1.5 border border-primary/10">
                        <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5 animate-pulse" />
                        <span className="text-primary font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* MAX PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex"
          >
            <GlassCard hover={false} className="flex-1 flex flex-col p-8 border border-border hover:border-muted-foreground/30 transition-all rounded-3xl bg-card/10">
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Max</h3>
                    <p className="text-xs text-muted-foreground mt-1">Guaranteed professional placement support</p>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-baseline text-foreground">
                      <span className="text-xs text-muted-foreground mr-1.5">From</span>
                      <span className="text-4xl font-extrabold tracking-tight">${prices.max}</span>
                      <span className="ml-1.5 text-xs text-muted-foreground font-medium">USD / month</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {billingCycle === "yearly" ? "billed annually" : "billed monthly"}
                    </p>
                  </div>
                </div>

                <button className="w-full rounded-2xl bg-muted/20 border border-border/80 px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/40 hover:scale-[1.01] active:scale-[0.99] transition-all">
                  Get Max plan
                </button>

                <div className="border-t border-border/60 pt-6">
                  <p className="text-xs font-semibold text-foreground mb-3">Everything in Pro, plus:</p>
                  <ul className="space-y-3.5 text-xs text-muted-foreground">
                    {[
                      "1-on-1 monthly mentorship call with a top tech recruiter",
                      "Priority referral network access in top companies",
                      "Unlimited cover letter generation & tailors",
                      "Dedicated placement manager support",
                      "No usage limits on any feature",
                    ].map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
                        <span className="text-foreground/90">{feat}</span>
                      </li>
                    ))}
                    
                    {/* Highlighted Upcoming features */}
                    <li className="flex items-start gap-2.5 bg-secondary/5 rounded-lg p-1.5 border border-secondary/10">
                      <Sparkles className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
                      <span className="text-secondary font-medium">Upcoming: Direct resume pushing to partner agencies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>

        </div>
      ) : (
        /* TEAM PLAN PANEL */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-2xl"
        >
          <GlassCard hover={false} className="p-8 text-center space-y-6 border border-border rounded-3xl bg-card/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Users className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Scale CareerPilot for teams</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Equip your university, bootcamp, or recruitment agency with state-of-the-art AI analytics, custom rubrics, and member performance dashboards.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-left text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Admin dashboard & metrics</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Custom AI grading rubrics</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Group seat discounts</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Dedicated account support</div>
            </div>
            <button className="rounded-xl bg-gradient-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold glow-ring">
              Contact Sales
            </button>
          </GlassCard>
        </motion.div>
      )}

      {/* ── Upcoming Features Spotlight ────────────────── */}
      <div className="space-y-6 pt-6 border-t border-border">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Upcoming Features in Pro</h2>
          <p className="text-xs text-muted-foreground mt-1">Get ready for game-changing additions to our platform, launching this quarter</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          <GlassCard hover={true} className="p-6 space-y-4 border border-border/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
              <Video className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">Live Expert Mock Interviews</h4>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20 rounded px-1.5 py-0.5">Pro Feature</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect live via video conference with verified industry veterans and hiring leads. Receive 1-on-1 personalized mock sessions and scoring.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-success font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <span>Launching in July</span>
            </div>
          </GlassCard>

          <GlassCard hover={true} className="p-6 space-y-4 border border-border/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">VR & AR Mock Simulator</h4>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5">Upcoming</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Immerse yourself in virtual office settings. Stand in front of realistic virtual panels to practice eye-contact, posture, and public speaking confidence.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-primary font-medium">
              <Play className="h-3.5 w-3.5 animate-pulse" />
              <span>Alpha testing soon</span>
            </div>
          </GlassCard>

          <GlassCard hover={true} className="p-6 space-y-4 border border-border/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <Users className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">1-on-1 Referral Exchange</h4>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-warning/10 text-warning border border-warning/20 rounded px-1.5 py-0.5">Max Feature</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlock direct lines to engineers and product managers who can refer you directly into open job pipelines, avoiding standard recruitment queues.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-warning font-medium">
              <Award className="h-3.5 w-3.5" />
              <span>Coming August</span>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
}
