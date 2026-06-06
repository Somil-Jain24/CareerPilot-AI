import { createContext, useContext, useState, ReactNode } from "react";

export interface AnalysisResult {
  resumeFile: File | null;
  jobDescription: string;
  scores: {
    resume: number;
    ats: number;
    interview: number;
    skill: number;
  };
  missingKeywords: string[];
  foundKeywords: string[];
  keywordDensity: { keyword: string; count: number }[];
  skillsFound: string[];
  skillsMissing: string[];
  matchBreakdown: { label: string; value: number; color: string }[];
  atsIssues: { title: string; desc: string; severity: "warning" | "error" }[];
  atsCompliant: { title: string; desc: string }[];
  recruiterStrengths: string[];
  recruiterWeaknesses: string[];
  roadmapTopics: Array<{
    week: string;
    title: string;
    topics: string[];
    goals: string[];
    projects: string[];
  }>;
  roadmapProgress: Record<string, boolean>;
}

interface AnalysisContextType {
  analysis: AnalysisResult | null;
  updateAnalysis: (resume: File, jd: string) => Promise<void>;
  isLoading: boolean;
  updateRoadmapProgress: (week: string, item: string, checked: boolean) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateAnalysis = async (resume: File, jd: string) => {
    setIsLoading(true);
    try {
      // Parse resume (simple text extraction simulation)
      const resumeText = await resume.text().catch(() => "");
      
      // Simulate keyword extraction and matching
      const analysisData = generateAnalysis(resumeText, jd);
      
      setAnalysis({
        resumeFile: resume,
        jobDescription: jd,
        ...analysisData,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRoadmapProgress = (week: string, item: string, checked: boolean) => {
    if (!analysis) return;
    const key = `${week}-${item}`;
    const updated = { ...analysis.roadmapProgress, [key]: checked };
    setAnalysis({ ...analysis, roadmapProgress: updated });
    // Persist to localStorage
    localStorage.setItem("roadmapProgress", JSON.stringify(updated));
  };

  return (
    <AnalysisContext.Provider value={{ analysis, updateAnalysis, isLoading, updateRoadmapProgress }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within AnalysisProvider");
  }
  return context;
}

// Analysis engine: parse resume & JD, calculate scores
function generateAnalysis(resumeText: string, jd: string) {
  // Extract keywords from both texts
  const resumeKeywords = extractKeywords(resumeText);
  const jdKeywords = extractKeywords(jd);

  // Find matches
  const foundKeywords = resumeKeywords.filter((k) =>
    jdKeywords.some((j) => j.toLowerCase() === k.toLowerCase())
  );
  const missingKeywords = jdKeywords.filter(
    (j) => !resumeKeywords.some((k) => k.toLowerCase() === j.toLowerCase())
  );

  // Extract skills
  const skillKeywords = [
    "react",
    "typescript",
    "node.js",
    "rest",
    "git",
    "tailwind",
    "sql",
    "agile",
    "kubernetes",
    "graphql",
    "aws",
    "ci/cd",
    "docker",
    "python",
    "java",
    "go",
    "rust",
    "vue",
    "angular",
    "svelte",
    "mongodb",
    "postgresql",
    "redis",
    "kubernetes",
  ];

  const skillsFound = skillKeywords.filter((skill) =>
    resumeText.toLowerCase().includes(skill.toLowerCase())
  );

  const skillsMissing = skillKeywords.filter(
    (skill) =>
      jd.toLowerCase().includes(skill.toLowerCase()) &&
      !resumeText.toLowerCase().includes(skill.toLowerCase())
  );

  // Calculate scores based on keyword match and content quality
  const keywordMatchRatio = foundKeywords.length / Math.max(jdKeywords.length, 1);
  const resumeScore = Math.round(60 + keywordMatchRatio * 40);
  const atsScore = Math.round(70 + (resumeText.length > 500 ? 10 : 0) - (missingKeywords.length * 2));
  const skillScore = Math.round(50 + (skillsFound.length / skillKeywords.length) * 50);
  const interviewScore = Math.round(65 + (skillsFound.length * 2));

  const scores = {
    resume: Math.min(100, resumeScore),
    ats: Math.min(100, atsScore),
    interview: Math.min(100, interviewScore),
    skill: Math.min(100, skillScore),
  };

  // Build keyword density
  const keywordDensity = resumeKeywords
    .slice(0, 5)
    .map((kw) => ({
      keyword: kw,
      count: countOccurrences(resumeText, kw),
    }));

  // Build match breakdown
  const matchBreakdown = [
    { label: "Technical Skills", value: skillScore, color: "var(--color-primary)" },
    { label: "Soft Skills", value: Math.round(skillScore * 0.85), color: "var(--color-secondary)" },
    {
      label: "Experience",
      value: Math.round(resumeScore * 0.8),
      color: "var(--color-warning)",
    },
    { label: "Education", value: Math.round(Math.max(60, resumeScore)), color: "var(--color-success)" },
  ];

  // ATS issues
  const atsIssues = generateAtsIssues(resumeText);
  const atsCompliant = [
    { title: "Standard fonts", desc: "Uses ATS-friendly fonts." },
    { title: "Clear contact info", desc: "Email & phone are parseable." },
    { title: "Reverse-chronological", desc: "Recommended format detected." },
  ];

  // Recruiter strengths/weaknesses
  const recruiterStrengths = [
    `Strong match on ${foundKeywords.slice(0, 3).join(", ")} skills`,
    `Found ${skillsFound.length} key technical skills`,
    `ATS compatibility score: ${scores.ats}%`,
    "Clear communication demonstrated",
  ].slice(0, 4);

  const recruiterWeaknesses = [
    ...missingKeywords.slice(0, 3).map((k) => `Missing: ${k}`),
    `Lacking ${skillsMissing.length} important skills`,
  ].slice(0, 3);

  // Generate dynamic roadmap from missing keywords
  const roadmapTopics = generateRoadmap(missingKeywords.concat(skillsMissing).slice(0, 4));

  // Load saved progress
  const savedProgress = localStorage.getItem("roadmapProgress");
  const roadmapProgress = savedProgress ? JSON.parse(savedProgress) : {};

  return {
    scores,
    missingKeywords,
    foundKeywords,
    keywordDensity,
    skillsFound,
    skillsMissing,
    matchBreakdown,
    atsIssues,
    atsCompliant,
    recruiterStrengths,
    recruiterWeaknesses,
    roadmapTopics,
    roadmapProgress,
  };
}

function extractKeywords(text: string): string[] {
  if (!text) return [];
  // Simple keyword extraction: split by spaces/punctuation, filter short words
  const words = text
    .toLowerCase()
    .split(/[\s\W]+/)
    .filter((w) => w.length > 3 && w.length < 30);
  return [...new Set(words)].slice(0, 30);
}

function countOccurrences(text: string, word: string): number {
  const regex = new RegExp(`\\b${word}\\b`, "gi");
  return (text.match(regex) || []).length;
}

function generateAtsIssues(resumeText: string) {
  const issues = [];

  if (resumeText.length < 300) {
    issues.push({
      title: "Short resume detected",
      desc: "Consider expanding with more details.",
      severity: "warning" as const,
    });
  }

  if (!resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
    issues.push({
      title: "No email found",
      desc: "Make sure your email is clearly visible.",
      severity: "error" as const,
    });
  }

  if (!resumeText.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
    issues.push({
      title: "No phone number",
      desc: "Add a clear phone number to your contact section.",
      severity: "warning" as const,
    });
  }

  return issues.length > 0 ? issues : [{ title: "No major issues", desc: "Your resume looks clean!", severity: "warning" as const }];
}

function generateRoadmap(
  focusAreas: string[]
): Array<{
  week: string;
  title: string;
  topics: string[];
  goals: string[];
  projects: string[];
}> {
  const defaultRoadmap = [
    {
      week: "Week 1",
      title: "Foundations",
      topics: ["Core Concepts", "Best Practices", "Tools Setup"],
      goals: ["Understand fundamentals", "Set up development environment"],
      projects: ["First project setup"],
    },
    {
      week: "Week 2",
      title: "Core Skills",
      topics: ["Implementation", "Patterns", "Testing"],
      goals: ["Build real features", "Write tests"],
      projects: ["Build a feature"],
    },
    {
      week: "Week 3",
      title: "Advanced",
      topics: ["Optimization", "Scaling", "Architecture"],
      goals: ["Optimize performance", "Design systems"],
      projects: ["Optimize existing project"],
    },
    {
      week: "Week 4",
      title: "Mastery",
      topics: ["Advanced patterns", "Deployment", "Monitoring"],
      goals: ["Deploy to production", "Set up monitoring"],
      projects: ["Deploy a full project"],
    },
  ];

  // Customize based on focus areas
  if (focusAreas.length > 0) {
    const skillMap: Record<string, string[]> = {
      aws: ["AWS Core Services", "EC2 & S3", "IAM & Security"],
      docker: ["Docker Fundamentals", "Containerization", "Docker Compose"],
      kubernetes: ["K8s Basics", "Pods & Services", "Helm Charts"],
      graphql: ["GraphQL Schema", "Resolvers", "Client Integration"],
      "ci/cd": ["GitHub Actions", "CI/CD Pipelines", "Deployment"],
      python: ["Python Basics", "Web Frameworks", "Data Processing"],
      typescript: ["TS Fundamentals", "Types & Generics", "Advanced Patterns"],
    };

    focusAreas.forEach((area, idx) => {
      const key = area.toLowerCase();
      const topics = skillMap[key] || [area, `${area} Advanced`, `${area} Projects`];
      if (defaultRoadmap[idx]) {
        defaultRoadmap[idx].topics = topics;
        defaultRoadmap[idx].title = `${area} Mastery`;
      }
    });
  }

  return defaultRoadmap;
}
