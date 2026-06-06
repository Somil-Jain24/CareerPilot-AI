import {
  Home,
  FileText,
  Target,
  Scan,
  Map,
  GraduationCap,
  Linkedin,
  MessageSquare,
  FolderGit2,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "ANALYZE",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: Home },
      { label: "Resume Analyzer", to: "/resume", icon: FileText },
      { label: "Match Analysis", to: "/match", icon: Target },
      { label: "ATS Scanner", to: "/ats", icon: Scan },
    ],
  },
  {
    title: "IMPROVE",
    items: [
      { label: "Skill Roadmap", to: "/roadmap", icon: Map },
      { label: "Learning Hub", to: "/resources", icon: GraduationCap },
      { label: "LinkedIn Optimizer", to: "/linkedin", icon: Linkedin },
    ],
  },
  {
    title: "PREPARE",
    items: [
      { label: "Interview Prep", to: "/interview", icon: MessageSquare },
      { label: "Portfolio Review", to: "/portfolio", icon: FolderGit2 },
    ],
  },
  {
    title: "RECRUITER",
    items: [
      { label: "Recruiter View", to: "/recruiter", icon: UserCheck },
    ],
  },
];
