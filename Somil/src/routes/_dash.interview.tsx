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

function InterviewPage() {
  const [mode, setMode] = useState<Mode>("Technical");
  const [qIndex, setQIndex] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: interviewQuestions.Technical[0] },
  ]);
  const [input, setInput] = useState("");
  const [evaluated, setEvaluated] = useState(false);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setQIndex(0);
    setEvaluated(false);
    setMessages([{ role: "ai", text: interviewQuestions[m][0] }]);
  };

  const send = () => {
    if (!input.trim()) return;
    const answer = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: answer }]);
    setInput("");
    setTyping(true);
    setEvaluated(false);
    setTimeout(() => {
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

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* chat */}
        <Reveal className="lg:col-span-2">
          <GlassCard hover={false} className="h-[520px] p-0 [&>div]:h-full [&>div]:flex [&>div]:flex-col">
            <div className="flex-1 min-h-0 space-y-4 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
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
            <div className="flex items-end gap-2 border-t border-border p-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Type your answer…"
                rows={1}
                className="flex-1 max-h-32 min-h-[44px] rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
              />
              <button
                onClick={send}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground glow-ring transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </GlassCard>
        </Reveal>

        {/* scorecard */}
        <Reveal delay={0.1}>
          <GlassCard hover={false} className="h-auto">
            <h3 className="mb-4 font-semibold">Answer Scorecard</h3>
            <div className="mb-4 grid grid-cols-2 gap-3">
              {interviewAttributes.map((a) => (
                <div key={a.attribute} className="rounded-xl bg-muted/30 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{a.attribute}</p>
                  <p className="font-display text-xl font-bold text-primary">
                    {evaluated ? a.value : "—"}
                  </p>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={interviewAttributes}>
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
              <Sparkles className="h-4 w-4 text-success" /> Ideal Industry Answer
            </h3>
            <p className="text-sm text-muted-foreground">{idealAnswers.default}</p>
          </GlassCard>
        </motion.div>
      )}
    </>
  );
}
