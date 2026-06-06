// CareerPilot AI — central mock data + helpers for the demo experience.

export type ScoreKey = "resume" | "ats" | "interview" | "skill";

export const scores = {
  resume: 82,
  ats: 76,
  interview: 71,
  skill: 68,
};

// CRI = 0.3*ATS + 0.25*Resume + 0.25*Interview + 0.2*Skill
export function computeCRI(s = scores): number {
  return Math.round(
    0.3 * s.ats + 0.25 * s.resume + 0.25 * s.interview + 0.2 * s.skill,
  );
}

export function scoreColor(value: number): string {
  if (value <= 40) return "var(--color-destructive)";
  if (value <= 70) return "var(--color-warning)";
  return "var(--color-success)";
}

export function scoreLabel(value: number): string {
  if (value <= 40) return "Needs Work";
  if (value <= 70) return "Getting There";
  return "Strong";
}

export const criHistory = [
  { month: "Jan", cri: 48, resume: 55, ats: 50, interview: 42 },
  { month: "Feb", cri: 54, resume: 60, ats: 55, interview: 48 },
  { month: "Mar", cri: 61, resume: 68, ats: 62, interview: 55 },
  { month: "Apr", cri: 67, resume: 74, ats: 68, interview: 63 },
  { month: "May", cri: 72, resume: 79, ats: 73, interview: 68 },
  { month: "Jun", cri: 76, resume: 82, ats: 76, interview: 71 },
];

export const matchBreakdown = [
  { label: "Technical Skills", value: 84, color: "var(--color-primary)" },
  { label: "Soft Skills", value: 72, color: "var(--color-secondary)" },
  { label: "Experience", value: 65, color: "var(--color-warning)" },
  { label: "Education", value: 90, color: "var(--color-success)" },
];

export const skillsFound = [
  "React",
  "TypeScript",
  "Node.js",
  "REST APIs",
  "Git",
  "Tailwind CSS",
  "SQL",
  "Agile",
];

export const skillsMissing = ["Kubernetes", "GraphQL", "AWS", "CI/CD", "Docker"];

export const keywordGaps = ["microservices", "scalability", "unit testing", "observability"];

export const atsIssues = [
  { title: "Tables detected", desc: "Resume uses tables that ATS parsers may misread.", severity: "warning" },
  { title: "Non-standard headings", desc: "Use standard section titles like 'Experience'.", severity: "warning" },
  { title: "Image-based text", desc: "An embedded logo contains unreadable text.", severity: "error" },
];

export const atsCompliant = [
  { title: "Standard fonts", desc: "Uses ATS-friendly fonts." },
  { title: "Clear contact info", desc: "Email & phone are parseable." },
  { title: "Reverse-chronological", desc: "Recommended format detected." },
];

export const keywordDensity = [
  { keyword: "React", count: 6 },
  { keyword: "TypeScript", count: 4 },
  { keyword: "API", count: 5 },
  { keyword: "Team", count: 3 },
  { keyword: "Cloud", count: 1 },
];

export const interviewAttributes = [
  { attribute: "Accuracy", value: 78 },
  { attribute: "Confidence", value: 71 },
  { attribute: "Communication", value: 85 },
  { attribute: "Completeness", value: 66 },
];

export const roadmap = [
  {
    week: "Week 1",
    title: "Cloud Foundations",
    topics: ["AWS Core Services", "IAM & Security", "EC2 & S3"],
    goals: ["Understand cloud primitives", "Deploy a static site to S3"],
    projects: ["Host portfolio on S3 + CloudFront"],
  },
  {
    week: "Week 2",
    title: "Containers & DevOps",
    topics: ["Docker", "CI/CD Pipelines", "GitHub Actions"],
    goals: ["Containerize an app", "Automate a build pipeline"],
    projects: ["Dockerize a Node API with CI"],
  },
  {
    week: "Week 3",
    title: "Orchestration",
    topics: ["Kubernetes Basics", "Pods & Services", "Helm"],
    goals: ["Deploy to a K8s cluster", "Scale workloads"],
    projects: ["Deploy microservice to Kubernetes"],
  },
  {
    week: "Week 4",
    title: "APIs at Scale",
    topics: ["GraphQL", "Observability", "Load Testing"],
    goals: ["Build a GraphQL gateway", "Add monitoring"],
    projects: ["GraphQL API with Grafana dashboards"],
  },
];

export const resources = [
  { title: "AWS Certified Cloud Practitioner", platform: "Coursera", type: "Courses", level: "Beginner", skill: "AWS", desc: "Foundational cloud certification prep." },
  { title: "Docker Crash Course", platform: "YouTube", type: "YouTube", level: "Beginner", skill: "Docker", desc: "Containers explained in 1 hour." },
  { title: "Kubernetes Documentation", platform: "kubernetes.io", type: "Documentation", level: "Intermediate", skill: "Kubernetes", desc: "Official concepts & guides." },
  { title: "GraphQL Full Course", platform: "freeCodeCamp", type: "YouTube", level: "Intermediate", skill: "GraphQL", desc: "Build APIs with GraphQL." },
  { title: "LeetCode System Design", platform: "LeetCode", type: "Practice Platforms", level: "Advanced", skill: "System Design", desc: "Practice scalable architecture." },
  { title: "CI/CD with GitHub Actions", platform: "Udemy", type: "Courses", level: "Intermediate", skill: "CI/CD", desc: "Automate your deployments." },
  { title: "AWS Hands-On Labs", platform: "A Cloud Guru", type: "Practice Platforms", level: "Intermediate", skill: "AWS", desc: "Real cloud sandbox labs." },
  { title: "TypeScript Handbook", platform: "typescriptlang.org", type: "Documentation", level: "Beginner", skill: "TypeScript", desc: "The official language guide." },
];

export const recruiterStrengths = [
  "Strong technical skills (React, TypeScript)",
  "Solid project portfolio",
  "ATS-friendly resume",
  "Clear communication",
];

export const recruiterWeaknesses = [
  "Missing cloud certifications",
  "Limited senior-level experience",
  "No DevOps exposure",
];

export const testimonials = [
  { name: "Aarav Patel", role: "SDE @ Fintech", quote: "CareerPilot's ATS fixes got me past the bots — 4 interviews in two weeks.", initials: "AP" },
  { name: "Lena Müller", role: "Product Designer", quote: "The interview coach felt like a real mock panel. My confidence score doubled.", initials: "LM" },
  { name: "Diego Santos", role: "New Grad, ML", quote: "The roadmap closed my skill gaps fast. Landed my dream offer.", initials: "DS" },
];

export const interviewQuestions = {
  Technical: [
    "Explain the difference between let, const, and var in JavaScript.",
    "How does the React virtual DOM improve performance?",
    "What is the time complexity of binary search and why?",
  ],
  HR: [
    "Tell me about yourself and your career goals.",
    "Describe a time you faced conflict in a team.",
    "Why do you want to work here?",
  ],
  Scenario: [
    "A production deploy just broke a key feature. Walk me through your response.",
    "You disagree with your manager's technical decision. What do you do?",
    "How would you onboard onto a large unfamiliar codebase?",
  ],
};

export const idealAnswers: Record<string, string> = {
  default:
    "A strong answer is structured (STAR for behavioral), specific with measurable impact, and connects your experience back to the role. Lead with the outcome, then explain your reasoning and the trade-offs you weighed.",
};
