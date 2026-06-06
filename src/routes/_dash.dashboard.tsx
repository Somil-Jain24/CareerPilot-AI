import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Upload,
  Mic,
  Map,
  FileText,
  ScanLine,
  ArrowRight,
  TrendingUp,
  Award,
  Lock,
  Check,
  ChevronRight,
  Sparkles,
  Search,
  Bell,
  Briefcase,
  FolderOpen,
  Target,
  Crown,
  Trophy
} from "lucide-react";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { Reveal } from "@/components/ui-ext/reveal";
import { useMetricsStore, computeCRIFromStore } from "@/lib/store";

export const Route = createFileRoute("/_dash/dashboard")({
  head: () => ({ meta: [{ title: "Employability Dashboard — CareerPilot AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const store = useMetricsStore();
  
  // Metrics values with fallbacks to match the mockup design
  const resumeScore = store.resumeScore || 88;
  const atsScore = store.atsScore || 88;
  const interviewScore = store.interviewScore || 71;
  const skillScore = store.skillScore || 92;
  const criScore = computeCRIFromStore({ ...store, resumeScore, atsScore, interviewScore, skillScore }) || 82;

  // Mock data for roadmap
  const roadmapSteps = [
    { name: "Java Basics", status: "completed" },
    { name: "OOP Concepts", status: "completed" },
    { name: "Data Structures", status: "current" },
    { name: "Spring Boot", status: "locked" },
    { name: "System Design", status: "locked" },
    { name: "Microservices", status: "locked" }
  ];

  // Mock job matches
  const jobMatches = [
    { title: "Senior Backend Engineer", company: "TechNova", type: "Remote", match: "92%" },
    { title: "Full Stack Developer", company: "CodeCraft", type: "Bengaluru", match: "88%" },
    { title: "Software Engineer II", company: "InnoSoft", type: "Hybrid", match: "85%" }
  ];

  // Mock skill gaps
  const skillGaps = ["Docker", "AWS", "Kubernetes", "System Design", "CI/CD"];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Hello Jordan Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Hello Jordan 👋
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
            Ready to land your next dream job?
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </p>
        </div>
      </div>

      {/* Grid: Left Main Area & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Quick Actions & Career Score */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Quick Actions Grid (Spans 9 columns on desktop) */}
            <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Upload Resume Card */}
              <Link to="/resume" className="group block">
                <GlassCard className="h-full p-5 flex flex-col justify-between hover:border-primary/50 transition-all duration-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="mt-5">
                    <h3 className="font-semibold text-foreground">Upload Resume</h3>
                    <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors flex items-center gap-1">
                      Get AI analysis in seconds <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </GlassCard>
              </Link>

              {/* Practice Interview Card */}
              <Link to="/interview" className="group block">
                <GlassCard className="h-full p-5 flex flex-col justify-between hover:border-teal-500/50 transition-all duration-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 group-hover:scale-110 transition-transform">
                    <Mic className="h-5 w-5" />
                  </div>
                  <div className="mt-5">
                    <h3 className="font-semibold text-foreground">Practice Interview</h3>
                    <p className="text-xs text-muted-foreground mt-1 group-hover:text-teal-600 transition-colors flex items-center gap-1">
                      AI mock interview coach <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </GlassCard>
              </Link>

              {/* Skill Roadmap Card */}
              <Link to="/roadmap" className="group block">
                <GlassCard className="h-full p-5 flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 group-hover:scale-110 transition-transform">
                    <Map className="h-5 w-5" />
                  </div>
                  <div className="mt-5">
                    <h3 className="font-semibold text-foreground">Skill Roadmap</h3>
                    <p className="text-xs text-muted-foreground mt-1 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                      Personalized learning path <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </GlassCard>
              </Link>
            </div>

            {/* Career Score Card (Spans 3 columns on desktop) */}
            <div className="md:col-span-4 lg:col-span-3">
              <GlassCard hover={false} className="p-5 h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Career Score
                </h3>
                
                {/* Circular Gauge */}
                <div className="relative flex items-center justify-center my-4">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="46" stroke="var(--border)" strokeWidth="7" fill="transparent" className="opacity-20" />
                    <circle cx="56" cy="56" r="46" stroke="var(--color-primary)" strokeWidth="7.5" fill="transparent"
                            strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - criScore / 100)}
                            strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-bold font-display text-foreground">{criScore}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                  <span>Strong Progress!</span>
                  <span>🔥</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  You're ahead of <span className="font-bold text-foreground">78%</span> of users
                </p>
              </GlassCard>
            </div>

          </div>

          {/* Resume Analysis Overview Container */}
          <GlassCard hover={false} className="p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-foreground">Resume Analysis Overview</h2>
              <Link to="/resume" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
                View Full Report <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PDF and ATS details */}
              <div className="space-y-4">
                {/* PDF File Block */}
                <div className="flex items-center gap-4 bg-muted/30 border border-border/50 rounded-2xl p-4">
                  <div className="h-12 w-10 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 font-bold text-xs">
                    PDF
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">Jordan_Dev_Resume.pdf</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Uploaded 2 min ago • 245 KB</p>
                  </div>
                  <span className="text-[10px] font-bold bg-teal-500/10 text-teal-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                    Analysis Complete
                  </span>
                </div>

                {/* ATS Score Block */}
                <div className="flex items-center justify-between bg-muted/20 border border-border/40 rounded-2xl p-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">ATS Score</p>
                    <p className="text-2xl font-extrabold text-foreground mt-1">
                      {atsScore}<span className="text-sm font-medium text-muted-foreground">/100</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Great! Your resume is ATS-friendly.</p>
                  </div>
                  {/* ATS Mini Gauge */}
                  <div className="relative flex items-center justify-center">
                    <svg className="w-14 h-14 transform -rotate-90">
                      <circle cx="28" cy="28" r="22" stroke="var(--border)" strokeWidth="3.5" fill="transparent" className="opacity-20" />
                      <circle cx="28" cy="28" r="22" stroke="oklch(0.62 0.15 162)" strokeWidth="4" fill="transparent"
                              strokeDasharray={2 * Math.PI * 22} strokeDashoffset={2 * Math.PI * 22 * (1 - atsScore / 100)}
                              strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-foreground">{atsScore}%</span>
                  </div>
                </div>
              </div>

              {/* Match Breakdown Progress Bars */}
              <div className="space-y-3.5 bg-muted/10 border border-border/30 rounded-2xl p-5 justify-center flex flex-col">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Match Breakdown</h3>
                
                {/* Skills Match */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Skills Match</span>
                    <span className="text-foreground font-bold">92%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>

                {/* Experience Match */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Experience Match</span>
                    <span className="text-foreground font-bold">80%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>

                {/* Education Match */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Education Match</span>
                    <span className="text-foreground font-bold">95%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "95%" }} />
                  </div>
                </div>

                {/* Keywords Match */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Keywords Match</span>
                    <span className="text-foreground font-bold">85%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Skill Roadmap & AI Interview Coach Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Skill Roadmap Dashboard Card */}
            <div className="rounded-3xl bg-slate-950 text-white p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[220px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-transparent to-purple-950/20 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base">Skill Roadmap</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Your personalized learning journey</p>
                  </div>
                  <Link to="/roadmap" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">
                    Continue Learning <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Horizontal Step Line */}
                <div className="mt-8 flex justify-between items-center relative px-2">
                  <div className="absolute left-6 right-6 top-3.5 h-[1.5px] bg-slate-800 z-0" />
                  
                  {roadmapSteps.map((step, idx) => (
                    <div key={step.name} className="flex flex-col items-center relative z-10">
                      {/* Badge / Circle */}
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center border text-xs font-semibold ${
                        step.status === "completed"
                          ? "bg-emerald-500 border-emerald-400 text-slate-950"
                          : step.status === "current"
                          ? "bg-indigo-600 border-indigo-400 text-white animate-pulse"
                          : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}>
                        {step.status === "completed" ? (
                          <Check className="h-4 w-4 stroke-[3px]" />
                        ) : step.status === "locked" ? (
                          <Lock className="h-3 w-3 text-slate-600" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                      
                      {/* Step Name */}
                      <span className="text-[9px] font-medium mt-2 text-slate-400 text-center w-12 truncate">
                        {step.name}
                      </span>
                      {step.status === "current" && (
                        <span className="text-[7px] text-indigo-400 font-bold uppercase tracking-wider mt-0.5">
                          In Progress
                        </span>
                      )}
                      {step.status === "completed" && (
                        <span className="text-[7px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                          Done
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Interview Coach Dashboard Card */}
            <div className="rounded-3xl bg-slate-950 text-white p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[220px]">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 to-slate-950 pointer-events-none" />
              
              {/* Cute Robot Icon Background */}
              <div className="absolute right-4 bottom-4 opacity-20 pointer-events-none">
                <svg className="w-24 h-24 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="font-bold text-base">AI Interview Coach</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Practice. Improve. Succeed.</p>
                </div>

                <div className="mt-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 max-w-[240px]">
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Next Session</p>
                  <p className="text-xs font-bold text-white mt-1">Behavioral Interview</p>
                  <p className="text-[10px] text-indigo-400 mt-0.5">Today, 7:00 PM</p>
                </div>

                <Link
                  to="/interview"
                  className="mt-5 block w-full text-center rounded-xl bg-gradient-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
                >
                  Start Practice
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Right 4 Columns - Sidebar Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Insights Card */}
          <div className="rounded-3xl bg-gradient-primary p-6 text-white relative overflow-hidden shadow-lg group">
            <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> AI Insights
            </h3>
            <p className="mt-4 text-sm leading-relaxed font-medium">
              Adding skills in <span className="font-bold underline decoration-white/50">Docker</span>, <span className="font-bold underline decoration-white/50">AWS</span> and <span className="font-bold underline decoration-white/50">System Design</span> can increase your match score by <span className="text-yellow-300 font-extrabold text-base">14%</span>.
            </p>
            <Link
              to="/suggestions"
              className="mt-6 block w-full text-center rounded-xl bg-white text-indigo-950 py-2.5 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              View Suggestions
            </Link>
          </div>

          {/* Top Job Matches */}
          <GlassCard hover={false} className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-foreground">Top Job Matches</h3>
              <Link to="/match" className="text-xs font-medium text-primary hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {jobMatches.map((job) => (
                <div key={job.title} className="flex justify-between items-center p-3 rounded-2xl border border-border/30 bg-muted/10 hover:border-border/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Briefcase className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{job.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{job.company} • {job.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded">
                    {job.match} Match
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/match"
              className="block w-full text-center rounded-xl bg-muted/40 hover:bg-muted/70 py-2.5 text-xs font-bold text-primary transition-colors border border-border/50"
            >
              Explore More Jobs
            </Link>
          </GlassCard>

          {/* Skill Gaps Card */}
          <GlassCard hover={false} className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-foreground">Skill Gaps</h3>
              <Link to="/roadmap" className="text-xs font-medium text-primary hover:underline">
                View All
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium bg-red-500/5 text-red-500 border border-red-500/25 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Badges Earned */}
          <GlassCard hover={false} className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-foreground">Badges Earned</h3>
              <Link to="/roadmap" className="text-xs font-medium text-primary hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Badge 1 */}
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shadow-inner">
                  <Award className="h-6 w-6" />
                </div>
                <span className="text-[9px] font-medium text-muted-foreground mt-1.5 leading-tight">Resume Optimizer</span>
              </div>
              
              {/* Badge 2 */}
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center shadow-inner">
                  <Trophy className="h-6 w-6" />
                </div>
                <span className="text-[9px] font-medium text-muted-foreground mt-1.5 leading-tight">Interview Master</span>
              </div>

              {/* Badge 3 */}
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-inner">
                  <Crown className="h-6 w-6" />
                </div>
                <span className="text-[9px] font-medium text-muted-foreground mt-1.5 leading-tight">ATS Expert</span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

      {/* Bottom Status / Metrics Bar */}
      <GlassCard hover={false} className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-border/60">
          
          {/* Col 1: Career Level */}
          <div className="flex items-center gap-3 pb-4 md:pb-0">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Career Level</p>
              <p className="text-sm font-bold text-foreground">Level 12</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">Career Explorer</p>
            </div>
          </div>

          {/* Col 2: XP Points */}
          <div className="flex items-center gap-3 pt-4 md:pt-0 md:pl-6">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">XP Points</p>
              <p className="text-sm font-bold text-foreground">2,350 XP</p>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">+150 this week</p>
            </div>
          </div>

          {/* Col 3: Analyses */}
          <div className="flex items-center gap-3 pt-4 md:pt-0 md:pl-6">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Analysis This Month</p>
              <p className="text-sm font-bold text-foreground">8 Analyses</p>
              <p className="text-[9px] text-blue-600 font-semibold mt-0.5">+2 from last month</p>
            </div>
          </div>

          {/* Col 4: Accuracy */}
          <div className="flex items-center gap-3 pt-4 md:pt-0 md:pl-6">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Accuracy Rate</p>
              <p className="text-sm font-bold text-foreground">94%</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">AI Prediction Accuracy</p>
            </div>
          </div>

          {/* Col 5: Sparkline Chart */}
          <div className="flex items-center justify-center pt-4 md:pt-0 md:pl-6 h-full min-h-[40px]">
            <svg className="h-9 w-full max-w-[120px] text-emerald-500" viewBox="0 0 100 30" fill="none">
              <path
                d="M5 24 L12 21 L20 25 L28 17 L36 22 L44 14 L52 19 L60 9 L68 15 L76 7 L84 12 L92 3 L98 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

        </div>
      </GlassCard>

    </div>
  );
}
