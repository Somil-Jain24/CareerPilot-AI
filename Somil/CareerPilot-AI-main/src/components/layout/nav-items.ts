import {
  LayoutDashboard,
  FileText,
  Target,
  ScanLine,
  Sparkles,
  MessagesSquare,
  Map,
  GraduationCap,
  Linkedin,
  FolderGit2,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Resume Analyzer", to: "/resume", icon: FileText },
  { label: "Match Analysis", to: "/match", icon: Target },
  { label: "ATS Analyzer", to: "/ats", icon: ScanLine },
  { label: "AI Suggestions", to: "/suggestions", icon: Sparkles },
  { label: "Interview Prep", to: "/interview", icon: MessagesSquare },
  { label: "Skill Roadmap", to: "/roadmap", icon: Map },
  { label: "Learning Hub", to: "/resources", icon: GraduationCap },
  { label: "LinkedIn Optimizer", to: "/linkedin", icon: Linkedin },
  { label: "Portfolio Review", to: "/portfolio", icon: FolderGit2 },
  { label: "Recruiter View", to: "/recruiter", icon: UserCheck },
];
