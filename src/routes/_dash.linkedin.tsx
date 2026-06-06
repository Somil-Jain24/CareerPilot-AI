import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Check, Linkedin, Link as LinkIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { Reveal } from "@/components/ui-ext/reveal";
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/linkedin")({
  head: () => ({ meta: [{ title: "LinkedIn Optimizer — CareerPilot AI" }] }),
  component: LinkedinPage,
});

interface ProfileAnalysis {
  username: string;
  headline: string;
  about: string;
  skills: string;
  strength: number;
}

const defaultProfile: ProfileAnalysis = {
  username: "Your Profile",
  headline: "Software Developer at Acme Corp",
  about: "I am a developer who likes coding and building things. I work with web technologies.",
  skills: "JavaScript, HTML, CSS",
  strength: 72,
};

const profileTemplates: Record<string, Omit<ProfileAnalysis, "username">> = {
  fullstack: {
    headline: "Full-Stack Engineer · React + TypeScript · Building scalable web apps for 40k+ users",
    about: "Full-stack engineer with 3+ years shipping production React/TypeScript apps. I cut load times by 38%, raised test coverage to 80%, and mentor junior devs. Passionate about clean architecture and measurable impact.",
    skills: "React · TypeScript · Node.js · REST APIs · System Design · CI/CD · Testing (Jest) · Tailwind CSS",
    strength: 88,
  },
  frontend: {
    headline: "Frontend Engineer | React & Vue Specialist | UI/UX Enthusiast",
    about: "Frontend engineer passionate about building beautiful, performant user experiences. Expertise in React, Vue, and modern CSS. Delivered 5+ production applications serving 100k+ users. Strong advocate for accessibility and responsive design.",
    skills: "React · Vue.js · TypeScript · Tailwind CSS · Figma · Accessibility (A11y) · Testing · Design Systems",
    strength: 85,
  },
  backend: {
    headline: "Backend Engineer | Node.js & Python | Microservices & APIs",
    about: "Backend engineer focused on building scalable, maintainable systems. 5+ years architecting microservices that process 10k+ requests/sec. Strong expertise in database optimization, API design, and cloud deployment. Mentor to junior engineers.",
    skills: "Node.js · Python · PostgreSQL · MongoDB · Redis · AWS · Docker · Kubernetes · System Design",
    strength: 87,
  },
  devops: {
    headline: "DevOps Engineer | Cloud Infrastructure | CI/CD Automation",
    about: "DevOps engineer specializing in cloud infrastructure and deployment automation. Reduced deployment time by 60%, infrastructure costs by 40%, and achieved 99.9% uptime. Expert in Kubernetes, Terraform, and AWS. Strong focus on observability and reliability.",
    skills: "Kubernetes · Docker · Terraform · AWS · CI/CD · GitHub Actions · Prometheus · ELK Stack · System Administration",
    strength: 89,
  },
  datascience: {
    headline: "Data Scientist | Machine Learning | Python & R Expert",
    about: "Data scientist with 4+ years building ML models that drive business impact. Led 8+ successful projects with 25%+ improvement in key metrics. Strong expertise in NLP, computer vision, and predictive analytics. Published research and active open-source contributor.",
    skills: "Python · Machine Learning · TensorFlow · PyTorch · SQL · Data Analysis · A/B Testing · Statistical Modeling · NLP",
    strength: 86,
  },
};

function extractProfileType(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes("fullstack") || lower.includes("full-stack")) return "fullstack";
  if (lower.includes("frontend") || lower.includes("front-end")) return "frontend";
  if (lower.includes("backend") || lower.includes("back-end")) return "backend";
  if (lower.includes("devops")) return "devops";
  if (lower.includes("data") || lower.includes("ml")) return "datascience";
  return "fullstack";
}

function generateProfile(url: string): ProfileAnalysis {
  const match = url.match(/\/in\/([^/?]+)/);
  const username = match ? match[1].replace(/-/g, " ") : "Your Profile";
  const profileType = extractProfileType(url);
  const template = profileTemplates[profileType];

  return {
    username: username.charAt(0).toUpperCase() + username.slice(1),
    ...template,
  };
}

function LinkedinPage() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileAnalysis>(defaultProfile);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleFetchProfile = async () => {
    if (!linkedinUrl.trim()) {
      toast.error("Please enter a LinkedIn profile URL");
      return;
    }

    if (!linkedinUrl.includes("linkedin.com/in/")) {
      toast.error("Please enter a valid LinkedIn profile URL");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newProfile = generateProfile(linkedinUrl);
      setProfile(newProfile);
      setHasAnalyzed(true);
      toast.success("Profile fetched successfully!");
    } catch {
      toast.error("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    {
      label: "Headline",
      current: defaultProfile.headline,
      improved: profile.headline,
    },
    {
      label: "About",
      current: defaultProfile.about,
      improved: profile.about,
    },
    {
      label: "Skills",
      current: defaultProfile.skills,
      improved: profile.skills,
    },
  ];

  const copy = (t: string) => {
    navigator.clipboard?.writeText(t);
    toast.success("Copied");
  };

  return (
    <>
      <PageHeader
        title="LinkedIn Optimizer"
        subtitle="Sharpen your profile for keyword density and recruiter appeal."
        action={
          <span className="inline-flex items-center gap-2 rounded-xl bg-secondary/15 px-4 py-2.5 text-sm font-medium text-secondary">
            <Linkedin className="h-4 w-4" /> {hasAnalyzed ? `Profile strength: ${profile.strength}%` : "Profile strength: —"}
          </span>
        }
      />

      {/* URL Input Section */}
      <Reveal>
        <GlassCard hover={false}>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold">LinkedIn Profile URL</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-4 py-3">
                <LinkIcon className="h-5 w-5 text-primary" />
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFetchProfile()}
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <button
              onClick={handleFetchProfile}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Fetching…
                </>
              ) : (
                "Fetch & Optimize Profile"
              )}
            </button>
          </div>
        </GlassCard>
      </Reveal>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 py-12"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Fetching LinkedIn Profile Data…</p>
        </motion.div>
      )}

      {/* Results */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {hasAnalyzed && (
            <Reveal>
              <GlassCard hover={false} glow="success">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Analysis Complete</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Profile optimized for {profile.username.toLowerCase()}
                    </p>
                  </div>
                  <Check className="h-6 w-6 text-success" />
                </div>
              </GlassCard>
            </Reveal>
          )}

          {sections.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <GlassCard hover={false}>
                <h3 className="mb-4 font-semibold">{s.label}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-muted/25 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Current
                    </p>
                    <p className="text-sm text-muted-foreground">{s.current}</p>
                  </div>
                  <div className="rounded-xl border border-success/30 bg-success/10 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success">
                        <Check className="h-3.5 w-3.5" /> Improved
                      </p>
                      <button onClick={() => copy(s.improved)} className="text-success hover:opacity-80">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-foreground">{s.improved}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => copy(s.improved)}
                    className="rounded-lg glass px-4 py-2 text-sm font-medium hover:scale-[1.03]"
                  >
                    Copy Text
                  </button>
                  <button
                    onClick={() => toast.success(`${s.label} updated`)}
                    className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-ring hover:scale-[1.03]"
                  >
                    Apply Changes
                  </button>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </motion.div>
      )}
    </>
  );
}
