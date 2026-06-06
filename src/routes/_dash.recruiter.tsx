import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  Sparkles,
  Users,
  CheckSquare,
  TrendingUp,
  Star,
  Bookmark,
  Briefcase,
  Search,
  Eye,
  MoreVertical,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  PieChart,
  Target,
  ArrowRight,
  FileText
} from "lucide-react";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/recruiter")({
  head: () => ({ meta: [{ title: "Recruiter View — CareerPilot AI" }] }),
  component: RecruiterPage,
});

interface Candidate {
  id: number;
  name: string;
  email: string;
  role: string;
  matchScore: number;
  skills: string[];
  extraSkillsCount: number;
  experience: string;
  status: "Shortlisted" | "Interviewing" | "New" | "Offered" | "Hired";
  avatarColor: string;
}

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Rohit Sharma",
    email: "rohit.sharma@email.com",
    role: "Backend Engineer",
    matchScore: 92,
    skills: ["Java", "Spring Boot", "AWS"],
    extraSkillsCount: 3,
    experience: "4.5 yrs",
    status: "Shortlisted",
    avatarColor: "bg-emerald-500",
  },
  {
    id: 2,
    name: "Sneha Iyer",
    email: "sneha.lyer@email.com",
    role: "Backend Engineer",
    matchScore: 86,
    skills: ["Python", "Django", "SQL"],
    extraSkillsCount: 2,
    experience: "3.8 yrs",
    status: "Interviewing",
    avatarColor: "bg-sky-500",
  },
  {
    id: 3,
    name: "Arjun Mehta",
    email: "arjun.mehta@email.com",
    role: "Full Stack Developer",
    matchScore: 81,
    skills: ["React", "Node.js", "MongoDB"],
    extraSkillsCount: 2,
    experience: "4.2 yrs",
    status: "Shortlisted",
    avatarColor: "bg-purple-500",
  },
  {
    id: 4,
    name: "Priya Nair",
    email: "priya.nair@email.com",
    role: "Frontend Developer",
    matchScore: 78,
    skills: ["React", "TypeScript", "Tailwind"],
    extraSkillsCount: 2,
    experience: "3.1 yrs",
    status: "Interviewing",
    avatarColor: "bg-amber-500",
  },
  {
    id: 5,
    name: "Karan Verma",
    email: "karan.verma@email.com",
    role: "DevOps Engineer",
    matchScore: 74,
    skills: ["AWS", "Docker", "Kubernetes"],
    extraSkillsCount: 3,
    experience: "3.6 yrs",
    status: "New",
    avatarColor: "bg-rose-500",
  },
  {
    id: 6,
    name: "Neha Kapoor",
    email: "neha.kapoor@email.com",
    role: "Full Stack Developer",
    matchScore: 71,
    skills: ["JavaScript", "React", "Node.js"],
    extraSkillsCount: 2,
    experience: "2.9 yrs",
    status: "New",
    avatarColor: "bg-indigo-500",
  },
];

function RecruiterPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [activeTab, setActiveTab] = useState<string>("All Candidates");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [scoreFilter, setScoreFilter] = useState("All Scores");

  // Filtering Logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Tab filter
      if (activeTab !== "All Candidates" && c.status !== activeTab) {
        return false;
      }
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesRole = c.role.toLowerCase().includes(query);
        const matchesEmail = c.email.toLowerCase().includes(query);
        const matchesSkills = c.skills.some((s) => s.toLowerCase().includes(query));
        if (!matchesName && !matchesRole && !matchesEmail && !matchesSkills) {
          return false;
        }
      }
      // Role filter
      if (roleFilter !== "All Roles" && c.role !== roleFilter) {
        return false;
      }
      // Score filter
      if (scoreFilter !== "All Scores") {
        if (scoreFilter === "90%+" && c.matchScore < 90) return false;
        if (scoreFilter === "80%-90%" && (c.matchScore < 80 || c.matchScore >= 90)) return false;
        if (scoreFilter === "Under 80%" && c.matchScore >= 80) return false;
      }
      return true;
    });
  }, [candidates, activeTab, searchQuery, roleFilter, scoreFilter]);

  const handleAddJobOpening = () => {
    toast.success("Job opening configuration opened!");
  };

  const handleAICandidateSearch = () => {
    toast.info("AI Candidate Search matched 14 new candidates!");
  };

  const handleExport = () => {
    toast.success("Candidates list exported successfully as CSV/PDF");
  };

  const viewCandidate = (name: string) => {
    toast.info(`Opening detailed profile analysis for ${name}`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Recruiter View
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Discover, analyze and shortlist the best talent with AI-powered insights.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAddJobOpening}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Job Opening
          </button>
          <button
            onClick={handleAICandidateSearch}
            className="rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 px-4 py-2.5 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md hover:opacity-95 transition-opacity"
          >
            <Sparkles className="h-4 w-4" /> AI Candidate Search
          </button>
        </div>
      </div>

      {/* Top 5 Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Candidates */}
        <GlassCard hover={false} className="p-4 flex items-center justify-between border-slate-100">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Candidates</h4>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">1,248</p>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +18% vs last month
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </GlassCard>

        {/* Card 2: Avg. Match Score */}
        <GlassCard hover={false} className="p-4 flex items-center justify-between border-slate-100">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Match Score</h4>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">76%</p>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +8% vs last month
            </span>
          </div>
          <div className="w-14 h-8 text-emerald-500 self-end mb-1">
            <svg className="h-full w-full" viewBox="0 0 50 20" fill="none">
              <path d="M0 18 L10 14 L20 15 L30 10 L40 6 L50 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </GlassCard>

        {/* Card 3: Shortlisted */}
        <GlassCard hover={false} className="p-4 flex items-center justify-between border-slate-100">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shortlisted</h4>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">156</p>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +12% vs last month
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bookmark className="h-5 w-5" />
          </div>
        </GlassCard>

        {/* Card 4: Hired */}
        <GlassCard hover={false} className="p-4 flex items-center justify-between border-slate-100">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hired</h4>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">32</p>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +14% vs last month
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckSquare className="h-5 w-5" />
          </div>
        </GlassCard>

        {/* Card 5: Open Positions */}
        <GlassCard hover={false} className="p-4 flex items-center justify-between border-slate-100">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Positions</h4>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">8</p>
            <span className="text-[10px] font-semibold text-rose-500 mt-1 block">
              2 urgent hiring
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <Briefcase className="h-5 w-5" />
          </div>
        </GlassCard>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Candidates Table (Spans 8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard hover={false} className="p-6 border-slate-100">
            {/* Table Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="font-bold text-base text-slate-950">Top Candidates</h3>
              
              <div className="flex flex-wrap gap-1 border-b border-slate-100 pb-1">
                {["All Candidates", "Shortlisted", "Interviewing", "Offered", "Hired"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === tab
                        ? "bg-slate-100 text-slate-950"
                        : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExport}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
              >
                Export Report
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 mb-6 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, skills or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-primary shadow-sm"
                />
              </div>

              {/* Roles Dropdown */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
              >
                <option value="All Roles">All Roles</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>

              {/* Location Dropdown */}
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
              >
                <option value="All Locations">All Locations</option>
                <option value="Bengaluru, India">Bengaluru, India</option>
                <option value="Remote">Remote</option>
                <option value="Pune, India">Pune, India</option>
              </select>

              {/* Score Dropdown */}
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
              >
                <option value="All Scores">Match Score</option>
                <option value="90%+">90%+</option>
                <option value="80%-90%">80% - 90%</option>
                <option value="Under 80%">Under 80%</option>
              </select>

              {/* Advanced Filter Button */}
              <button
                onClick={() => toast.info("Opening advanced filters")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              </button>
            </div>

            {/* Candidates Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-center">Match Score</th>
                    <th className="py-3 px-4">Key Skills</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                        {/* Candidate Name & Email */}
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full ${c.avatarColor} text-white flex items-center justify-center font-bold text-[10px]`}>
                            {c.name.split(" ").map(w => w[0]).join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-950">{c.name}</p>
                            <p className="text-[10px] text-slate-400">{c.email}</p>
                          </div>
                        </td>
                        {/* Role */}
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {c.role}
                        </td>
                        {/* Match Score */}
                        <td className="py-3.5 px-4">
                          <div className="flex justify-center">
                            <div className="relative h-9 w-9 flex items-center justify-center">
                              <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="18" cy="18" r="14" stroke="var(--border)" strokeWidth="3" fill="transparent" className="opacity-20" />
                                <circle cx="18" cy="18" r="14" stroke="var(--color-primary)" strokeWidth="3" fill="transparent"
                                        strokeDasharray={2 * Math.PI * 14} strokeDashoffset={2 * Math.PI * 14 * (1 - c.matchScore / 100)}
                                        strokeLinecap="round" />
                              </svg>
                              <span className="text-[10px] font-bold text-slate-900">{c.matchScore}%</span>
                            </div>
                          </div>
                        </td>
                        {/* Key Skills */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1">
                            {c.skills.map((skill) => (
                              <span key={skill} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200/40">
                                {skill}
                              </span>
                            ))}
                            {c.extraSkillsCount > 0 && (
                              <span className="text-[10px] text-slate-400 font-bold ml-0.5">
                                +{c.extraSkillsCount}
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Experience */}
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {c.experience}
                        </td>
                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            c.status === "Shortlisted"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : c.status === "Interviewing"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => viewCandidate(c.name)}
                              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toast.info("Candidate actions triggered")}
                              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No candidates match your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold">
                Showing 1 to {filteredCandidates.length} of 1,248 candidates
              </span>

              <div className="flex items-center gap-1.5">
                <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-400">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="h-8 w-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </button>
                <button className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center">
                  2
                </button>
                <button className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center">
                  3
                </button>
                <span className="text-slate-400 px-1">...</span>
                <button className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center">
                  208
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Funnel, Skills & Job Openings (Spans 4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hiring Funnel Card */}
          <GlassCard hover={false} className="p-5 border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-950">Hiring Funnel</h3>
              <button onClick={() => toast.info("Opening full funnel report")} className="text-xs font-semibold text-primary hover:underline">
                View Full Report
              </button>
            </div>

            {/* Custom Funnel Design */}
            <div className="flex items-center gap-6">
              {/* Funnel SVG */}
              <div className="flex-1 max-w-[150px]">
                <svg viewBox="0 0 100 120" className="w-full h-auto">
                  {/* Layer 1: Applied */}
                  <polygon points="5,5 95,5 85,22 15,22" fill="url(#gradient-applied)" />
                  {/* Layer 2: Screened */}
                  <polygon points="17,25 83,25 75,42 25,42" fill="url(#gradient-screened)" />
                  {/* Layer 3: Shortlisted */}
                  <polygon points="27,45 73,45 66,62 34,62" fill="url(#gradient-shortlisted)" />
                  {/* Layer 4: Interviewing */}
                  <polygon points="36,65 64,65 58,82 42,82" fill="url(#gradient-interviewing)" />
                  {/* Layer 5: Offered */}
                  <polygon points="44,85 56,85 52,102 48,102" fill="url(#gradient-offered)" />
                  {/* Layer 6: Hired */}
                  <polygon points="49,105 51,105 50.5,120 49.5,120" fill="url(#gradient-hired)" />

                  <defs>
                    <linearGradient id="gradient-applied" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <linearGradient id="gradient-screened" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                    <linearGradient id="gradient-shortlisted" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                    <linearGradient id="gradient-interviewing" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                    <linearGradient id="gradient-offered" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                    <linearGradient id="gradient-hired" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Legend with counts */}
              <div className="space-y-1.5 text-[10px] font-semibold text-slate-500 flex-1">
                {[
                  { label: "Applied", count: "1,248" },
                  { label: "Screened", count: "842" },
                  { label: "Shortlisted", count: "156" },
                  { label: "Interviewing", count: "78" },
                  { label: "Offered", count: "32" },
                  { label: "Hired", count: "16" }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between border-b border-slate-50 pb-0.5">
                    <span>{item.label}</span>
                    <span className="text-slate-900 font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Top Skills in Pipeline Card */}
          <GlassCard hover={false} className="p-5 border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-950">Top Skills in Pipeline</h3>
              <button onClick={() => toast.info("Opening all skills pipeline details")} className="text-xs font-semibold text-primary hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: "JavaScript", value: 78, color: "bg-indigo-600" },
                { label: "Python", value: 65, color: "bg-blue-500" },
                { label: "React", value: 62, color: "bg-cyan-500" },
                { label: "AWS", value: 58, color: "bg-emerald-500" },
                { label: "SQL", value: 52, color: "bg-teal-500" }
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>{item.label}</span>
                    <span className="text-slate-900">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Active Job Openings Card */}
          <GlassCard hover={false} className="p-5 border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-950">Active Job Openings</h3>
              <button onClick={() => toast.info("Viewing all job openings")} className="text-xs font-semibold text-primary hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {[
                { title: "Backend Engineer", loc: "Bengaluru, India", count: 23 },
                { title: "Full Stack Developer", loc: "Remote", count: 18 },
                { title: "DevOps Engineer", loc: "Pune, India", count: 15 }
              ].map((job) => (
                <div key={job.title} className="flex justify-between items-center border-b border-slate-50 pb-2.5 last:border-b-0 last:pb-0">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{job.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{job.loc}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900">{job.count}</span>
                    <p className="text-[9px] text-slate-400">Applicants</p>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddJobOpening}
                className="w-full text-center text-xs font-bold text-primary hover:underline border border-dashed border-slate-200 hover:border-primary bg-slate-50/50 py-2.5 rounded-xl flex items-center justify-center gap-1 mt-2 transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> Add New Opening
              </button>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Bottom Grid row: Match Score Distribution, Source, AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Match Score Distribution (Donut Chart) */}
        <div className="lg:col-span-4 flex">
          <GlassCard hover={false} className="w-full p-5 border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-950">Match Score Distribution</h3>
              <button onClick={() => toast.info("Opening full match report")} className="text-xs font-semibold text-primary hover:underline">
                View Report
              </button>
            </div>

            <div className="flex items-center justify-between gap-6 py-2">
              {/* Donut Chart SVG */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Outer circle */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3.5" />
                  
                  {/* Segment 1: 80% and above (38%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4"
                          strokeDasharray="38 62" strokeDashoffset="100" />
                  
                  {/* Segment 2: 60% - 80% (42%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4"
                          strokeDasharray="42 58" strokeDashoffset="62" />

                  {/* Segment 3: 40% - 60% (15%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4"
                          strokeDasharray="15 85" strokeDashoffset="20" />

                  {/* Segment 4: Below 40% (5%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4"
                          strokeDasharray="5 95" strokeDashoffset="5" />
                </svg>
                <div className="absolute text-center flex flex-col justify-center">
                  <span className="text-sm font-bold text-slate-900">Score</span>
                  <span className="text-[10px] text-slate-400 font-semibold leading-none">Spread</span>
                </div>
              </div>

              {/* Legend with percentages */}
              <div className="space-y-1.5 text-[10px] font-semibold text-slate-500 flex-1">
                {[
                  { label: "80% and above", pct: "38%", color: "bg-emerald-500" },
                  { label: "60% - 80%", pct: "42%", color: "bg-blue-500" },
                  { label: "40% - 60%", pct: "15%", color: "bg-amber-500" },
                  { label: "Below 40%", pct: "5%", color: "bg-rose-500" }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0`} />
                      {item.label}
                    </span>
                    <span className="text-slate-900 font-extrabold">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Source of Candidates */}
        <div className="lg:col-span-4 flex">
          <GlassCard hover={false} className="w-full p-5 border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-950">Source of Candidates</h3>
              <button onClick={() => toast.info("Opening sources report")} className="text-xs font-semibold text-primary hover:underline">
                View Report
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: "LinkedIn", value: 45, color: "bg-indigo-600" },
                { label: "Naukri", value: 25, color: "bg-sky-500" },
                { label: "Referral", value: 15, color: "bg-emerald-500" },
                { label: "CareerPortal", value: 10, color: "bg-yellow-500" },
                { label: "Others", value: 5, color: "bg-red-400" }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 text-[10px] font-semibold text-slate-600">
                  <span className="w-20 truncate">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                  <span className="w-8 text-right text-slate-950 font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* AI Insights Card */}
        <div className="lg:col-span-4 flex">
          <GlassCard hover={false} className="w-full p-5 border-slate-100 bg-violet-50/25 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-950">AI Insights</h3>
              </div>

              <div className="space-y-3.5">
                {[
                  { text: "26% of candidates in pipeline have excellent System Design skills.", color: "text-blue-600 bg-blue-100/50" },
                  { text: "Candidates with AWS skills have 32% higher shortlist rate.", color: "text-purple-600 bg-purple-100/50" },
                  { text: "Consider relaxing experience criteria for Backend roles to increase pipeline by 18%.", color: "text-indigo-600 bg-indigo-100/50" }
                ].map((insight, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${insight.color}`}>
                      ★
                    </span>
                    <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                      {insight.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-semibold mt-4 text-center">
              Insights updated 10 minutes ago
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
