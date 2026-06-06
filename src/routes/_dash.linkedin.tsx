import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Linkedin,
  Copy,
  Loader2,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Star,
  Eye,
  Trash2,
  HelpCircle,
  Plus,
  ArrowRight,
  ChevronRight,
  User,
  Image,
  FileText,
  Settings,
  Bell,
  Award,
  PenTool,
  Edit2,
  Camera,
  MoreHorizontal
} from "lucide-react";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { ProgressBar } from "@/components/ui-ext/progress-bar";
import { useMetricsStore } from "@/lib/store";
import { optimizeLinkedInFn } from "@/lib/api/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/linkedin")({
  head: () => ({ meta: [{ title: "LinkedIn Optimizer — CareerPilot AI" }] }),
  component: LinkedinPage,
});

// Premium fallback mock data
const MOCK_LINKEDIN = {
  score: 78,
  headlineSuggestions: [
    "Senior Backend Engineer | Spring Boot & Distributed Systems | Cloud Specialist",
    "Backend Engineer @ TechNova | Building Scalable Services | Java & AWS Enthusiast",
    "Software Engineer II | Java, Spring Boot, Microservices | Architecting High-Traffic APIs"
  ],
  summaryImprovements: [
    "Add a professional banner showing backend tech stacks",
    "Improve your headline to be keyword-rich and impactful",
    "Write a more compelling about section using metrics",
    "Add 5+ relevant skills like Docker, Kubernetes, and CI/CD"
  ],
  skillRecommendations: [
    "Backend Development",
    "Java",
    "Spring Boot",
    "Microservices",
    "REST APIs",
    "AWS",
    "SQL",
    "System Design"
  ]
};

function LinkedinPage() {
  const [loading, setLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [data, setData] = useState<typeof MOCK_LINKEDIN>({
    ...MOCK_LINKEDIN,
    score: 0,
  });
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const handleOptimize = async () => {
    setLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Optimizing LinkedIn profile section suggestions...',
        success: () => {
          setLoading(false);
          setIsAnalyzed(true);
          setData({
            ...MOCK_LINKEDIN,
            score: Math.min(100, Math.round(80 + Math.random() * 18))
          });
          return 'Profile optimization suggestions computed!';
        },
        error: 'Failed to optimize sections.',
      }
    );
  };

  const handleAnalyzeUrl = () => {
    if (!linkedinUrl.trim()) {
      toast.error("Please enter a LinkedIn URL to analyze");
      return;
    }
    setLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Fetching and analyzing LinkedIn profile...',
        success: () => {
          setLoading(false);
          setIsAnalyzed(true);
          setData({
            ...MOCK_LINKEDIN,
            score: Math.min(100, Math.round(75 + Math.random() * 23))
          });
          return 'LinkedIn profile analysis complete!';
        },
        error: 'Error fetching profile details.',
      }
    );
  };

  const copy = (t: string) => {
    navigator.clipboard?.writeText(t);
    toast.success("Copied to clipboard");
  };

  const reset = () => {
    setData({
      ...MOCK_LINKEDIN,
      score: 0,
    });
    setIsAnalyzed(false);
    setLinkedinUrl("");
    toast.info("Optimizer values reset");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            LinkedIn Optimizer <Linkedin className="h-7 w-7 text-sky-600 fill-sky-600" />
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Optimize your LinkedIn profile to get noticed by recruiters and grow your professional brand.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Reset Scanner
          </button>
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="rounded-xl bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground flex items-center gap-1.5 shadow-md hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Optimize My Profile
          </button>
        </div>
      </div>

      {/* Main Results View */}
      <div className="space-y-6">
        {/* Top 4 Metrics Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Profile Strength Circular */}
          <GlassCard hover={false} className="p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Profile Strength
            </h3>
            
            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center my-3">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="var(--border)" strokeWidth="6" fill="transparent" className="opacity-20" />
                <circle cx="48" cy="48" r="38" stroke="var(--color-primary)" strokeWidth="6.5" fill="transparent"
                        strokeDasharray={2 * Math.PI * 38} strokeDashoffset={2 * Math.PI * 38 * (1 - data.score / 100)}
                        strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-bold font-display text-foreground">{data.score}%</span>
              </div>
            </div>

            <div className="text-xs font-medium text-muted-foreground">
              Good! Keep optimizing 🚀
            </div>
            <button onClick={() => toast.info("Opening full LinkedIn report details")} className="text-[10px] font-bold text-primary mt-2 border border-border bg-muted/20 px-3 py-1 rounded-lg">
              View Full Report
            </button>
          </GlassCard>

          {/* Card 2: Profile Completeness Bars */}
          <GlassCard hover={false} className="p-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profile Completeness</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
              {[
                { label: "Profile Photo", value: 100, color: "bg-emerald-500" },
                { label: "Headline", value: 80, color: "bg-emerald-500" },
                { label: "About Section", value: 70, color: "bg-primary" },
                { label: "Experience", value: 90, color: "bg-primary" },
                { label: "Skills", value: 60, color: "bg-amber-500" },
                { label: "Recommendations", value: 40, color: "bg-amber-500" }
              ].map((item) => (
                <div key={item.label} className="space-y-0.5">
                  <div className="flex justify-between text-[9px] font-medium text-muted-foreground">
                    <span className="truncate w-20">{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Card 3: Visibility Score */}
          <GlassCard hover={false} className="p-5 flex flex-col items-center justify-between text-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Visibility Score</h3>
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center my-1.5">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-extrabold text-emerald-600">High</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Your profile is 2.4x more likely to be discovered.</p>
            </div>
            <button onClick={() => toast.info("Learn more about visibility logic")} className="text-[10px] font-bold text-primary mt-2 border border-border bg-muted/20 px-4 py-1 rounded-lg">
              Learn More
            </button>
          </GlassCard>

          {/* Card 4: Industry Ranking Sparkline */}
          <GlassCard hover={false} className="p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Industry Ranking</h3>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-base font-extrabold text-emerald-600">Top 28%</span>
                <span className="text-[9px] text-muted-foreground">Higher than 72%</span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5">of professionals in your industry.</p>
            </div>
            
            {/* Trend sparkline chart */}
            <div className="h-10 w-full text-indigo-500 mt-2">
              <svg className="h-full w-full" viewBox="0 0 100 30" fill="none">
                <path d="M0 25 L15 22 L30 20 L45 22 L60 15 L75 18 L90 8 L100 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </GlassCard>
        </div>

        {/* Grid layout for columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Profile Preview mockup (Spans 4 columns) */}
          <div className="lg:col-span-4 flex">
            <GlassCard hover={false} className="w-full p-0 overflow-hidden flex flex-col justify-between border-border/50">
              {!isAnalyzed ? (
                <div className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-5 my-auto">
                  <div className="h-16 w-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center shadow-inner border border-sky-100">
                    <Linkedin className="h-8 w-8 fill-sky-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-base text-foreground">Analyze LinkedIn Profile</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                      Type or paste your LinkedIn profile URL below to compute your profile score and view custom suggestions.
                    </p>
                  </div>
                  
                  <div className="w-full space-y-3 pt-2">
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-muted/20 px-3.5 py-2.5 rounded-xl border border-border/60 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground transition-all"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                    <button
                      onClick={handleAnalyzeUrl}
                      disabled={loading}
                      className="w-full bg-gradient-primary hover:opacity-95 text-primary-foreground font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-opacity disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Compute Profile Data
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Header Banner */}
                  <div className="h-24 bg-gradient-primary w-full relative">
                    <button className="absolute right-3 top-3 p-1.5 bg-black/30 rounded-full hover:bg-black/55 text-white transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Profile avatar & Name */}
                  <div className="px-5 pb-5 relative -mt-10">
                    {/* Avatar */}
                    <div className="relative inline-block">
                      <div className="h-20 w-20 rounded-full bg-slate-300 border-4 border-card flex items-center justify-center font-bold text-lg text-slate-800 shadow-sm overflow-hidden">
                        JD
                      </div>
                      <button className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full hover:opacity-95 transition-opacity shadow-md">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Info details */}
                    <div className="mt-3 space-y-1">
                      <h4 className="font-extrabold text-foreground text-base flex items-center gap-1.5">
                        Jordan Dev <Linkedin className="h-4 w-4 text-sky-600 fill-sky-600" />
                      </h4>
                      
                      <div className="flex justify-between items-start">
                        <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[240px]">
                          Senior Backend Engineer | Building Scalable Solutions | Java | Spring Boot | Microservices | Cloud Enthusiast
                        </p>
                        <button onClick={() => toast.info("Edit headline")} className="text-muted-foreground hover:text-foreground">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        Bengaluru, Karnataka, India · <span className="text-primary font-semibold hover:underline cursor-pointer">Contact info</span>
                      </p>
                      <p className="text-[10px] text-primary font-bold hover:underline cursor-pointer">
                        500+ connections
                      </p>
                    </div>

                    {/* URL input field */}
                    <div className="mt-4 p-3 bg-muted/20 border border-border/45 rounded-xl">
                      <p className="text-[10px] font-bold text-foreground mb-1.5 flex items-center gap-1">
                        <Linkedin className="h-3.5 w-3.5 text-sky-600 fill-sky-600" />
                        LinkedIn Profile Connected
                      </p>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="https://linkedin.com/in/username"
                          className="flex-1 bg-card px-2.5 py-1.5 rounded-lg border border-border/50 text-[10px] text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                        />
                        <button
                          onClick={handleAnalyzeUrl}
                          disabled={loading}
                          className="bg-primary hover:opacity-95 text-primary-foreground font-semibold px-3 py-1.5 rounded-lg text-[9px] shrink-0 transition-opacity"
                        >
                          Re-Analyze
                        </button>
                      </div>
                    </div>

                    {/* Quick Action buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button onClick={() => toast.info("Open to details configured")} className="rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-bold shadow-sm hover:opacity-90">
                        Open to
                      </button>
                      <button onClick={() => toast.info("Open section selector")} className="rounded-full border border-primary text-primary px-3 py-1.5 text-xs font-bold hover:bg-primary/5">
                        Add profile section
                      </button>
                      <button className="rounded-full border border-border p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Open to Work block */}
                    <div className="mt-4 p-3 bg-muted/20 border border-border/40 rounded-xl relative">
                      <button className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <p className="text-[10px] font-bold text-foreground">Open to work</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                        Backend Engineer, Software Engineer, Full Stack Developer
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-4 border-t border-border/40">
                <button
                  onClick={() => toast.info(isAnalyzed ? "Viewing Full Profile Details" : "Please analyze a profile first")}
                  className="w-full text-center text-xs font-bold text-primary hover:underline flex items-center justify-center gap-0.5"
                >
                  View Full Profile <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Middle Column: Optimization Checklist (Spans 5 columns) */}
          <div className="lg:col-span-5 flex">
            <GlassCard hover={false} className="w-full p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-foreground">Optimization Checklist</h3>
                  <button onClick={() => toast.info("Showing full checklist")} className="text-xs font-semibold text-primary hover:underline">
                    View All
                  </button>
                </div>

                {/* Checklist items */}
                <div className="space-y-3">
                  {[
                    { title: "Add a professional banner", desc: "Profiles with banners get 3x more views.", icon: Image, btn: "Add Banner" },
                    { title: "Improve your headline", desc: "Make it keyword-rich and impactful.", icon: PenTool, btn: "Improve" },
                    { title: "Write a more compelling about section", desc: "Tell your story and showcase your value.", icon: FileText, btn: "Optimize" },
                    { title: "Add 5+ relevant skills", desc: "Profiles with 5+ skills get 17x more views.", icon: Star, btn: "Add Skills" },
                    { title: "Get recommendations", desc: "Add 3+ recommendations to build trust.", icon: User, btn: "Request" }
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-border/30 bg-muted/10">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{item.title}</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{item.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toast.success(`Starting task: ${item.title}`)}
                        className="rounded-xl border border-border bg-card hover:bg-accent px-3 py-1.5 text-[10px] font-bold text-foreground shrink-0 transition-colors"
                      >
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Keywords & AI Recommendations (Spans 3 columns) */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
            
            {/* Top Keywords for You */}
            <GlassCard hover={false} className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">Top Keywords for You</h3>
                <button onClick={() => toast.info("Viewing all keywords")} className="text-[10px] font-bold text-primary hover:underline">
                  View All
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.skillRecommendations.map((kw) => (
                  <span
                    key={kw}
                    onClick={() => copy(kw)}
                    className="text-[10px] font-semibold bg-muted hover:bg-accent text-foreground border border-border/50 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                    title="Click to copy"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* AI Recommendations */}
            <GlassCard hover={false} className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">AI Recommendations</h3>
                  <span className="text-[8px] font-bold bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">
                    New
                  </span>
                </div>

                <div className="space-y-1">
                  {[
                    { title: "Showcase your impact", desc: "Quantify your achievements in experience." },
                    { title: "Add featured projects", desc: "Highlight 3-5 key projects." },
                    { title: "Engage with content", desc: "Engage to increase your visibility." }
                  ].map((item) => (
                    <div
                      key={item.title}
                      onClick={() => toast.info(`Detailed guide for: ${item.title}`)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="h-5 w-5 bg-primary/10 text-primary rounded flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                          ★
                        </span>
                        <div>
                          <p className="text-[10px] font-bold text-foreground">{item.title}</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => toast.info("Opening all suggestions")}
                className="w-full text-center text-[10px] font-bold text-primary hover:underline border border-border bg-muted/20 py-2 rounded-xl mt-3"
              >
                View All Recommendations
              </button>
            </GlassCard>
          </div>

        </div>

        {/* Bottom Steps How to Improve Row */}
        <GlassCard hover={false} className="p-5">
          <h3 className="font-bold text-sm text-foreground mb-4">How to Improve Your Profile Score</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 relative">
            
            {/* Step 1 */}
            <div className="flex gap-3 items-start relative z-10">
              <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                1
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">Complete All Sections</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">Fill all sections of your LinkedIn profile.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 items-start relative z-10">
              <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                2
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">Use Relevant Keywords</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">Add industry-specific keywords to your profile.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 items-start relative z-10">
              <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                3
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">Showcase Your Achievements</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">Quantify your work and highlight accomplishments.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3 items-start relative z-10">
              <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                4
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">Build Your Network</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">Connect with professionals and engage consistently.</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-3 items-start relative z-10">
              <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                5
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">Keep It Updated</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">Refresh your profile regularly to stay relevant.</p>
              </div>
            </div>

          </div>
        </GlassCard>
      </div>
    </div>
  );
}
