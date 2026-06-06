import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/ui-ext/page-header";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { Reveal } from "@/components/ui-ext/reveal";
import { cn } from "@/lib/utils";
import {
  interviewQuestions,
  interviewAttributes,
  idealAnswers,
} from "@/lib/career-data";

export const Route = createFileRoute("/_dash/interview")({
  head: () => ({ meta: [{ title: "Interview Prep — CareerPilot AI" }] }),
  component: InterviewPage,
});

type Mode = keyof typeof interviewQuestions;
type Msg = { role: "ai" | "user"; text: string };

interface ScoreResult {
  accuracy: number;
  confidence: number;
  communication: number;
  completeness: number;
}

function evaluateAnswer(answer: string, mode: Mode): ScoreResult {
  const baseScore = 60;
  const length = answer.length;

  let completeness = baseScore;
  let accuracy = baseScore;
  let communication = baseScore;
  let confidence = baseScore;

  // Length evaluation
  if (length > 100) completeness += 20;
  else if (length > 50) completeness += 10;
  else if (length < 20) completeness -= 20;

  // Structure evaluation (STAR method, examples)
  const hasExamples = /example|instance|such as|for instance/.test(answer.toLowerCase());
  const hasMeasurableImpact = /\d+%|improved|increased|reduced|saved/.test(answer);
  const hasAction = /implemented|created|designed|built|developed/.test(answer.toLowerCase());

  if (hasExamples) accuracy += 15;
  if (hasMeasurableImpact) {
    accuracy += 10;
    confidence += 10;
  }
  if (hasAction) {
    accuracy += 10;
    completeness += 10;
  }

  // Mode-specific evaluation
  if (mode === "Technical") {
    const techKeywords = ["algorithm", "architecture", "performance", "optimization", "database"];
    const matchedKeywords = techKeywords.filter((kw) => answer.toLowerCase().includes(kw)).length;
    accuracy += matchedKeywords * 5;
  } else if (mode === "HR") {
    const softKeywords = ["team", "collaboration", "learn", "growth", "feedback"];
    const matchedKeywords = softKeywords.filter((kw) => answer.toLowerCase().includes(kw)).length;
    communication += matchedKeywords * 5;
  } else if (mode === "Scenario") {
    const actionKeywords = ["steps", "process", "approach", "strategy", "solution"];
    const matchedKeywords = actionKeywords.filter((kw) => answer.toLowerCase().includes(kw)).length;
    confidence += matchedKeywords * 5;
  }

  // Communication cues
  if (answer.includes(",") || answer.includes(".")) communication += 10;
  if (answer.match(/\b\w+ing\b/g)) confidence += 5;

  return {
    accuracy: Math.min(100, accuracy),
    confidence: Math.min(100, confidence),
    communication: Math.min(100, communication),
    completeness: Math.min(100, completeness),
  };
}

function InterviewPage() {
  const [mode, setMode] = useState<Mode>("Technical");
  const [qIndex, setQIndex] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: interviewQuestions.Technical[0] },
  ]);
  const [input, setInput] = useState("");
  const [evaluated, setEvaluated] = useState(false);
  const [typing, setTyping] = useState(false);
  const [scores, setScores] = useState<ScoreResult>({
    accuracy: 0,
    confidence: 0,
    communication: 0,
    completeness: 0,
  });
  const [feedback, setFeedback] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setQIndex(0);
    setEvaluated(false);
    setScores({ accuracy: 0, confidence: 0, communication: 0, completeness: 0 });
    setMessages([{ role: "ai", text: interviewQuestions[m][0] }]);
  };

  const generateFeedback = (answer: string, scores: ScoreResult): string => {
    if (scores.completeness < 50) {
      return "Good start, but try using the STAR method (Situation, Task, Action, Result) to elaborate on your actions.";
    }
    if (scores.accuracy < 60) {
      return "Consider adding more specific examples and measurable outcomes to strengthen your answer.";
    }
    if (scores.communication < 60) {
      return "Great content! Next time, focus on clear structure and better organization of your thoughts.";
    }
    const avgScore = (scores.accuracy + scores.completeness + scores.confidence + scores.communication) / 4;
    if (avgScore >= 80) {
      return "Excellent answer! You demonstrated strong knowledge and clear communication. Ready for the next challenge.";
    }
    if (avgScore >= 70) {
      return "Good answer with solid examples. Add more quantifiable impact details to make it even stronger.";
    }
    return "Solid effort. Focus on providing specific examples and tying your experience back to the role requirements.";
  };

  const send = () => {
    if (!input.trim()) return;
    const answer = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: answer }]);
    setInput("");
    setTyping(true);
    setEvaluated(false);

    setTimeout(() => {
      const evaluatedScores = evaluateAnswer(answer, mode);
      setScores(evaluatedScores);
      const feedbackText = generateFeedback(answer, evaluatedScores);
      setFeedback(feedbackText);

      const next = (qIndex + 1) % interviewQuestions[mode].length;
      setTyping(false);
      setEvaluated(true);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Evaluated ✓ — here's your scorecard. Next question:" },
        { role: "ai", text: interviewQuestions[mode][next] },
      ]);
      setQIndex(next);
    }, 1300);
  };

  return (
    <>
      <PageHeader
        title="Interview Preparation"
        subtitle="Practice with an AI panel that scores every answer."
      />

      <div className="flex flex-wrap gap-2">
        {(Object.keys(interviewQuestions) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-all",
              mode === m
                ? "bg-gradient-primary text-primary-foreground glow-ring"
                : "glass hover:scale-[1.03]",
            )}
          >
            {m} Questions
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* chat */}
        <Reveal className="lg:col-span-2">
          <GlassCard hover={false} className="flex h-[520px] flex-col p-0">
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        m.role === "ai" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary",
                      )}
                    >
                      {m.role === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </span>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                        m.role === "ai"
                          ? "rounded-tl-sm bg-muted/40"
                          : "rounded-tr-sm bg-gradient-primary text-primary-foreground",
                      )}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {typing && (
                <div className="flex items-center gap-2 pl-11 text-muted-foreground">
                  <motion.span
                    className="flex gap-1"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    <span className="h-2 w-2 rounded-full bg-current" />
                    <span className="h-2 w-2 rounded-full bg-current" />
                  </motion.span>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="flex items-center gap-2 border-t border-border p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your answer…"
                className="h-11 flex-1 rounded-xl border border-border bg-muted/20 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={send}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground glow-ring transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </GlassCard>
        </Reveal>

        {/* scorecard */}
        <Reveal delay={0.1}>
          <GlassCard hover={false} className="h-full">
            <h3 className="mb-4 font-semibold">Answer Scorecard</h3>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/30 p-3 text-center">
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="font-display text-xl font-bold text-primary">
                  {evaluated ? scores.accuracy : "—"}
                </p>
              </div>
              <div className="rounded-xl bg-muted/30 p-3 text-center">
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="font-display text-xl font-bold text-secondary">
                  {evaluated ? scores.confidence : "—"}
                </p>
              </div>
              <div className="rounded-xl bg-muted/30 p-3 text-center">
                <p className="text-xs text-muted-foreground">Communication</p>
                <p className="font-display text-xl font-bold text-warning">
                  {evaluated ? scores.communication : "—"}
                </p>
              </div>
              <div className="rounded-xl bg-muted/30 p-3 text-center">
                <p className="text-xs text-muted-foreground">Completeness</p>
                <p className="font-display text-xl font-bold text-success">
                  {evaluated ? scores.completeness : "—"}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart
                data={[
                  { attribute: "Accuracy", value: evaluated ? scores.accuracy : 0 },
                  { attribute: "Confidence", value: evaluated ? scores.confidence : 0 },
                  { attribute: "Communication", value: evaluated ? scores.communication : 0 },
                  { attribute: "Completeness", value: evaluated ? scores.completeness : 0 },
                ]}
              >
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="attribute" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="value"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={evaluated ? 0.4 : 0.05}
                />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>
        </Reveal>
      </div>

      {evaluated && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          <GlassCard hover={false}>
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <User className="h-4 w-4 text-secondary" /> Your Answer
            </h3>
            <p className="text-sm text-muted-foreground">
              {messages.filter((m) => m.role === "user").slice(-1)[0]?.text}
            </p>
          </GlassCard>
          <GlassCard hover={false} glow="success">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-success" /> AI Feedback
            </h3>
            <p className="text-sm text-muted-foreground">{feedback || idealAnswers.default}</p>
          </GlassCard>
        </motion.div>
      )}
    </>
  );
}
