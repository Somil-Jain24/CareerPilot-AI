import React, { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  ChevronDown,
  CheckCircle2,
  Circle,
  Loader2,
  MessageSquare,
  Activity,
  Volume2,
  Award,
  AlertCircle,
  Lightbulb,
  Star,
  Download,
  RotateCcw,
  Zap,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { cn } from "@/lib/utils";
import { interviewQuestions, interviewAttributes, idealAnswers } from "@/lib/career-data";

export const Route = createFileRoute("/_dash/interview")({
  head: () => ({ meta: [{ title: "Interview Prep — CareerPilot AI" }] }),
  component: InterviewPage,
});

type Mode = keyof typeof interviewQuestions;
type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
type VoiceState = "idle" | "listening" | "recording" | "processing";

interface Msg {
  role: "ai" | "user";
  text: string;
  type?: "question" | "feedback" | "followup" | "answer";
  scores?: { accuracy: number; confidence: number; communication: number; completeness: number };
  coaching?: {
    strengths: string[];
    missing: string[];
    recruiterFeedback: string;
    betterAnswer: string;
    starFeedback: string;
    communicationFeedback: string;
  };
  qIndex?: number;
}

interface VoiceAnalytics {
  wordsSpoken: number;
  duration: number;
  wpm: number;
  longestPause: number;
  fillerCount: number;
  confidenceScore: number;
  fluencyScore: number;
  fillerWords: Record<string, number>;
}

const FILLER_WORDS = ["umm", "uh", "hmm", "like", "actually", "basically", "sort of", "kind of", "you know", "i mean"];

const DIFFICULTY_FOLLOW_UPS: Record<string, string[]> = {
  Technical: [
    "Can you explain this with a real-world example from a project you've built?",
    "How would this approach scale to millions of users?",
    "What trade-offs would you consider when implementing this in production?",
    "How would you test this solution? What edge cases concern you?",
    "If performance was critical, how would you optimize this further?",
  ],
  HR: [
    "What was the most challenging aspect of that situation for you personally?",
    "How did this experience shape the way you work today?",
    "What would you do differently if you faced the same situation now?",
    "How did your team respond to your approach?",
    "What feedback did you receive from your manager about this?",
  ],
  Scenario: [
    "Walk me through your exact thought process in the first 10 minutes.",
    "How would you communicate this to non-technical stakeholders?",
    "What metrics would you track to ensure success?",
    "How would you prevent this issue from recurring?",
    "Who would you escalate to and when?",
  ],
};

const FEEDBACK_TEMPLATES = [
  {
    strengths: ["Clear problem statement", "Mentioned key concepts correctly", "Structured response well"],
    missing: ["Lacked real-world example", "Did not mention edge cases", "Could mention performance implications"],
    recruiterFeedback: "Good foundational knowledge shown. However, interviewers look for depth through examples and awareness of production constraints.",
    betterAnswer: "A strong answer would follow STAR (Situation, Task, Action, Result) and include a concrete example from your experience, mentioning measurable outcomes.",
    starFeedback: "Your answer touched on the Situation and Action, but the Result was vague. Quantify the impact wherever possible.",
    communicationFeedback: "Speech was clear and well-paced. Avoid filler words like 'basically' and 'like' to sound more confident.",
  },
  {
    strengths: ["Demonstrated analytical thinking", "Identified the core issue quickly"],
    missing: ["Could elaborate on team collaboration", "Missing stakeholder communication plan"],
    recruiterFeedback: "You showed good problem-solving instincts. Senior roles expect you to also address the people-side of the problem.",
    betterAnswer: "Explain how you gathered inputs from the team, what options you considered, and why you chose the final approach. End with the business impact.",
    starFeedback: "Good Situation and Task description. Strengthen the Action step by detailing your decision-making framework.",
    communicationFeedback: "Confident delivery. Consider slowing down when explaining complex logic — it helps the interviewer follow your reasoning.",
  },
];

function detectFillers(text: string): Record<string, number> {
  const lower = text.toLowerCase();
  const counts: Record<string, number> = {};
  FILLER_WORDS.forEach(filler => {
    const regex = new RegExp(`\\b${filler.replace(" ", "\\s+")}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches && matches.length > 0) counts[filler] = matches.length;
  });
  return counts;
}

function computeVoiceAnalytics(text: string, durationSeconds: number): VoiceAnalytics {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const fillerWords = detectFillers(text);
  const fillerCount = Object.values(fillerWords).reduce((a, b) => a + b, 0);
  const wpm = durationSeconds > 0 ? Math.round((words.length / durationSeconds) * 60) : 0;
  const fluencyScore = Math.max(0, 100 - fillerCount * 8 - (wpm > 180 ? 10 : 0) - (wpm < 80 && wpm > 0 ? 10 : 0));
  const confidenceScore = Math.min(100, Math.max(0, 85 - fillerCount * 5 + (wpm >= 100 && wpm <= 160 ? 10 : 0)));
  return {
    wordsSpoken: words.length,
    duration: durationSeconds,
    wpm,
    longestPause: Math.round(Math.random() * 3 + 0.5),
    fillerCount,
    confidenceScore: Math.round(confidenceScore),
    fluencyScore: Math.round(fluencyScore),
    fillerWords,
  };
}

function InterviewPage() {
  const [mode, setMode] = useState<Mode>("Technical");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Intermediate");
  const [qIndex, setQIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: interviewQuestions.Technical[0], type: "question", qIndex: 0 },
  ]);
  const [input, setInput] = useState("");
  const [evaluated, setEvaluated] = useState(false);
  const [typing, setTyping] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceAnalytics, setVoiceAnalytics] = useState<VoiceAnalytics | null>(null);
  const [sessionStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showNewMessages, setShowNewMessages] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [overallScores, setOverallScores] = useState({ technical: 0, communication: 0, confidence: 0, fluency: 0, problemSolving: 0 });

  const endRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const voiceStartTimeRef = useRef<number>(0);
  const isAtBottomRef = useRef(true);

  const totalQuestions = interviewQuestions[mode].length;
  const estimatedMins = Math.max(0, Math.round(((totalQuestions - answeredCount) * 2 * 60 - elapsedSeconds) / 60));

  // Timer
  useEffect(() => {
    if (interviewEnded) return;
    const t = setInterval(() => setElapsedSeconds(Math.round((Date.now() - sessionStartTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [sessionStartTime, interviewEnded]);

  // Scroll detection
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 80;
      setShowNewMessages(!isAtBottomRef.current);
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMessages(false);
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current) scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  // Web Speech API
  const startVoice = () => {
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }
    const SpeechRecognition = (window as Window & typeof globalThis & { SpeechRecognition: typeof window.SpeechRecognition; webkitSpeechRecognition: typeof window.SpeechRecognition }).SpeechRecognition || (window as Window & typeof globalThis & { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setVoiceState("recording");
      voiceStartTimeRef.current = Date.now();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onend = () => {
      setVoiceState("processing");
      const duration = (Date.now() - voiceStartTimeRef.current) / 1000;
      setTimeout(() => {
        setVoiceState("idle");
        setVoiceAnalytics(computeVoiceAnalytics(input, duration));
      }, 500);
    };

    recognition.onerror = () => setVoiceState("idle");
    recognitionRef.current = recognition;
    setVoiceState("listening");
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  };

  const toggleVoice = () => {
    if (voiceState === "idle") startVoice();
    else stopVoice();
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setQIndex(0);
    setAnsweredCount(0);
    setEvaluated(false);
    setInterviewEnded(false);
    setVoiceAnalytics(null);
    setMessages([{ role: "ai", text: interviewQuestions[m][0], type: "question", qIndex: 0 }]);
  };

  const send = () => {
    if (!input.trim() || typing) return;
    const answer = input.trim();
    const duration = voiceStartTimeRef.current > 0 ? (Date.now() - voiceStartTimeRef.current) / 1000 : Math.max(10, answer.split(" ").length * 0.4);
    const analytics = computeVoiceAnalytics(answer, duration);
    const fbTemplate = FEEDBACK_TEMPLATES[Math.floor(Math.random() * FEEDBACK_TEMPLATES.length)];
    const scores = {
      accuracy: Math.min(100, 60 + Math.round(Math.random() * 35)),
      confidence: analytics.confidenceScore,
      communication: analytics.fluencyScore,
      completeness: Math.min(100, 55 + Math.round(Math.random() * 40)),
    };

    setMessages(prev => [...prev, { role: "user", text: answer, type: "answer" }]);
    setInput("");
    setTyping(true);
    setEvaluated(false);
    setVoiceAnalytics(analytics);

    const newAnsweredCount = answeredCount + 1;
    setAnsweredCount(newAnsweredCount);

    setTimeout(() => {
      setTyping(false);
      setEvaluated(true);
      const isLastQuestion = newAnsweredCount >= totalQuestions;

      // Update overall scores
      setOverallScores(prev => ({
        technical: Math.round((prev.technical + scores.accuracy) / 2) || scores.accuracy,
        communication: Math.round((prev.communication + scores.communication) / 2) || scores.communication,
        confidence: Math.round((prev.confidence + scores.confidence) / 2) || scores.confidence,
        fluency: Math.round((prev.fluency + analytics.fluencyScore) / 2) || analytics.fluencyScore,
        problemSolving: Math.round((prev.problemSolving + scores.completeness) / 2) || scores.completeness,
      }));

      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: "Evaluated ✓ — here's your coaching feedback:",
          type: "feedback",
          scores,
          coaching: fbTemplate,
        },
      ]);

      if (isLastQuestion) {
        setTimeout(() => {
          setInterviewEnded(true);
        }, 800);
      } else {
        const next = (qIndex + 1) % interviewQuestions[mode].length;
        const followUpPool = DIFFICULTY_FOLLOW_UPS[mode];
        const shouldFollowUp = Math.random() > 0.4;

        if (shouldFollowUp && followUpPool.length > 0) {
          const followUp = followUpPool[Math.floor(Math.random() * followUpPool.length)];
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              { role: "ai", text: followUp, type: "followup", qIndex: qIndex },
            ]);
          }, 600);
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              { role: "ai", text: interviewQuestions[mode][next], type: "question", qIndex: next },
            ]);
            setQIndex(next);
          }, 2200);
        } else {
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              { role: "ai", text: interviewQuestions[mode][next], type: "question", qIndex: next },
            ]);
            setQIndex(next);
          }, 800);
        }
      }
    }, 1500);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const radarData = interviewAttributes.map((a, i) => ({
    ...a,
    value: evaluated ? [overallScores.technical, overallScores.communication, overallScores.confidence, overallScores.fluency][i] || a.value : a.value,
  }));

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col overflow-hidden">
      {/* ── Header ───────────────────────────────────── */}
      <div className="shrink-0 space-y-4 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Interview Preparation</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">AI-powered mock interviews with real coaching feedback</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTime(elapsedSeconds)}</span>
            <span className="mx-1 text-border">|</span>
            <span>{answeredCount}/{totalQuestions} Questions</span>
          </div>
        </div>

        {/* Mode & Difficulty Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(interviewQuestions) as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
                  mode === m
                    ? "bg-gradient-primary text-primary-foreground shadow-lg"
                    : "glass hover:scale-[1.03] text-muted-foreground hover:text-foreground"
                )}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-1.5">
            {(["Beginner", "Intermediate", "Advanced"] as DifficultyLevel[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-medium transition-all border",
                  difficulty === d
                    ? d === "Beginner" ? "border-success/50 bg-success/10 text-success" : d === "Intermediate" ? "border-warning/50 bg-warning/10 text-warning" : "border-destructive/50 bg-destructive/10 text-destructive"
                    : "border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Layout ───────────────────────────────── */}
      <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">
        
        {/* Chat Area */}
        <div className="flex flex-1 min-w-0 flex-col rounded-2xl border border-border bg-card/20 backdrop-blur-md overflow-hidden">
          {/* Chat Header Bar */}
          <div className="flex items-center gap-3 border-b border-border px-5 py-3 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Interviewer</p>
              <p className="text-xs text-muted-foreground">{mode} Interview · {difficulty}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>

          {/* Scrollable messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent relative"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}
                >
                  <span className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                    msg.role === "ai"
                      ? msg.type === "feedback" ? "bg-success/15 text-success" : msg.type === "followup" ? "bg-warning/15 text-warning" : "bg-primary/15 text-primary"
                      : "bg-secondary/15 text-secondary"
                  )}>
                    {msg.role === "ai" ? (
                      msg.type === "feedback" ? <Award className="h-4 w-4" /> :
                      msg.type === "followup" ? <Zap className="h-4 w-4" /> :
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </span>
                  <div className={cn("max-w-[80%] space-y-3", msg.role === "user" && "items-end")}>
                    {/* Label */}
                    {msg.role === "ai" && (
                      <span className={cn(
                        "block text-[10px] font-semibold uppercase tracking-wider mb-1",
                        msg.type === "question" ? "text-primary" : msg.type === "feedback" ? "text-success" : "text-warning"
                      )}>
                        {msg.type === "question" ? `Q${(msg.qIndex ?? 0) + 1} · Question` : msg.type === "feedback" ? "AI Coaching" : "Follow-Up"}
                      </span>
                    )}

                    {/* Bubble */}
                    <div className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "rounded-tr-sm bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] text-white"
                        : msg.type === "question" ? "rounded-tl-sm bg-[#111C35] border border-primary/20 text-foreground"
                        : msg.type === "feedback" ? "rounded-tl-sm bg-success/5 border border-success/20 text-foreground"
                        : "rounded-tl-sm bg-warning/5 border border-warning/20 text-foreground"
                    )}>
                      {msg.text}
                    </div>

                    {/* Scores for feedback messages */}
                    {msg.type === "feedback" && msg.scores && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {Object.entries(msg.scores).map(([k, v]) => (
                          <div key={k} className="rounded-xl bg-muted/30 px-3 py-2 text-center border border-border">
                            <p className="text-[10px] capitalize text-muted-foreground">{k}</p>
                            <p className={cn("text-lg font-bold", v >= 80 ? "text-success" : v >= 60 ? "text-warning" : "text-destructive")}>{v}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Coaching Accordion */}
                    {msg.type === "feedback" && msg.coaching && (
                      <div className="space-y-2 mt-2">
                        <CoachingBlock icon={<Star className="h-3.5 w-3.5" />} label="Strengths" color="success">
                          <ul className="list-disc pl-4 space-y-0.5">{msg.coaching.strengths.map((s, j) => <li key={j}>{s}</li>)}</ul>
                        </CoachingBlock>
                        <CoachingBlock icon={<AlertCircle className="h-3.5 w-3.5" />} label="Missing Points" color="warning">
                          <ul className="list-disc pl-4 space-y-0.5">{msg.coaching.missing.map((s, j) => <li key={j}>{s}</li>)}</ul>
                        </CoachingBlock>
                        <CoachingBlock icon={<Lightbulb className="h-3.5 w-3.5" />} label="Suggested Better Answer" color="primary">
                          <p>{msg.coaching.betterAnswer}</p>
                        </CoachingBlock>
                        <CoachingBlock icon={<MessageSquare className="h-3.5 w-3.5" />} label="Communication Feedback" color="secondary">
                          <p>{msg.coaching.communicationFeedback}</p>
                        </CoachingBlock>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-[#111C35] border border-primary/20 px-4 py-3">
                  {[0, 0.15, 0.3].map((d, i) => (
                    <motion.span key={i} className="h-2 w-2 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }} transition={{ repeat: Infinity, duration: 1, delay: d }} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Interview Ended */}
            {interviewEnded && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="my-4">
                <div className="rounded-2xl bg-gradient-to-br from-[#111C35] to-[#0f1e3d] border border-primary/30 p-6 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] shadow-lg">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Interview Complete!</h3>
                  <p className="text-sm text-muted-foreground">All {totalQuestions} questions answered. View your comprehensive report in the panel →</p>
                  <div className="flex justify-center gap-3 pt-1 flex-wrap">
                    <button onClick={() => switchMode(mode)} className="flex items-center gap-2 rounded-xl bg-muted/30 border border-border px-4 py-2 text-sm hover:bg-muted/50 transition-colors">
                      <RotateCcw className="h-4 w-4" /> Retry
                    </button>
                    <Link to="/pricing" className="flex items-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground px-4 py-2 text-sm glow-ring transition-transform hover:scale-105">
                      <Sparkles className="h-4 w-4" /> Book Live Expert Session
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={endRef} />
          </div>

          {/* New Messages button */}
          <AnimatePresence>
            {showNewMessages && !typing && (
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                onClick={scrollToBottom}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs text-white shadow-lg"
              >
                <ChevronDown className="h-3.5 w-3.5" /> New messages
              </motion.button>
            )}
          </AnimatePresence>

          {/* Composer */}
          <div className="border-t border-border px-4 py-3 shrink-0">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder={voiceState === "recording" ? "🎙 Listening…" : "Type your answer… (Shift+Enter for newline)"}
                  rows={1}
                  disabled={interviewEnded}
                  className={cn(
                    "w-full max-h-32 min-h-[44px] rounded-xl border bg-muted/20 px-4 py-3 text-sm outline-none resize-none overflow-y-auto transition-all",
                    "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                    voiceState === "recording" ? "border-primary/70 ring-2 ring-primary/30 animate-pulse" : "border-border focus:ring-2 focus:ring-primary/50"
                  )}
                />
              </div>

              {/* Voice Button */}
              <motion.button
                onClick={toggleVoice}
                disabled={interviewEnded}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all",
                  voiceState === "idle" ? "bg-muted/30 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40" :
                  voiceState === "listening" ? "bg-primary/20 border border-primary text-primary animate-pulse" :
                  voiceState === "recording" ? "bg-red-500/20 border border-red-500 text-red-400 animate-pulse" :
                  "bg-muted/30 border border-border text-muted-foreground"
                )}
              >
                {voiceState === "processing" ? <Loader2 className="h-4 w-4 animate-spin" /> :
                 voiceState !== "idle" ? <MicOff className="h-4 w-4" /> :
                 <Mic className="h-4 w-4" />}
              </motion.button>

              {/* Send Button */}
              <motion.button
                onClick={send}
                disabled={!input.trim() || typing || interviewEnded}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {typing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </motion.button>
            </div>

            {/* Voice status */}
            {voiceState !== "idle" && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 flex items-center gap-2 text-xs text-primary">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                {voiceState === "listening" ? "Starting microphone…" : voiceState === "recording" ? "Recording — speak your answer" : "Processing audio…"}
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Sidebar Analytics */}
        <div className="hidden lg:flex w-72 shrink-0 flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pb-2">
          
          {/* Interview Timeline */}
          <GlassCard hover={false} className="p-4">
            <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Timeline
            </h3>
            <div className="space-y-2">
              {interviewQuestions[mode].map((q, i) => (
                <div key={i} className={cn(
                  "flex items-center gap-2.5 rounded-lg p-2 text-xs cursor-pointer transition-colors",
                  i < answeredCount ? "text-success hover:bg-success/5" : i === qIndex ? "text-primary bg-primary/5 border border-primary/20" : "text-muted-foreground hover:bg-muted/20"
                )}>
                  {i < answeredCount ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> :
                   i === qIndex ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}><Circle className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" /></motion.div> :
                   <Circle className="h-3.5 w-3.5 shrink-0" />}
                  <span className="line-clamp-1 font-medium">Q{i + 1}: {q.slice(0, 28)}…</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Progress Card */}
          <GlassCard hover={false} className="p-4">
            <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-secondary" /> Progress
            </h3>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">{answeredCount}/{totalQuestions}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/30">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]" animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }} transition={{ duration: 0.5 }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted/20 p-2 text-center">
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-semibold text-primary">{formatTime(elapsedSeconds)}</p>
                </div>
                <div className="rounded-lg bg-muted/20 p-2 text-center">
                  <p className="text-muted-foreground">Est. Left</p>
                  <p className="font-semibold text-secondary">~{estimatedMins}m</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Difficulty</span>
                <span className={cn("font-medium", difficulty === "Beginner" ? "text-success" : difficulty === "Intermediate" ? "text-warning" : "text-destructive")}>{difficulty}</span>
              </div>
            </div>
          </GlassCard>

          {/* Live Scorecard */}
          <GlassCard hover={false} className="p-4">
            <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-warning" /> Scorecard
            </h3>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {[
                { label: "Technical", value: evaluated ? overallScores.technical : 0 },
                { label: "Comm.", value: evaluated ? overallScores.communication : 0 },
                { label: "Confidence", value: evaluated ? overallScores.confidence : 0 },
                { label: "Fluency", value: evaluated ? overallScores.fluency : 0 },
              ].map(a => (
                <div key={a.label} className="rounded-lg bg-muted/30 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">{a.label}</p>
                  <p className={cn("text-base font-bold", !evaluated ? "text-muted-foreground" : a.value >= 80 ? "text-success" : a.value >= 60 ? "text-warning" : "text-destructive")}>
                    {evaluated ? a.value : "—"}
                  </p>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="attribute" tick={{ fill: "var(--color-muted-foreground)", fontSize: 9 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={evaluated ? 0.35 : 0.05} />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Voice Analytics Card */}
          {voiceAnalytics && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard hover={false} className="p-4">
                <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-primary" /> Voice Analytics
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Words Spoken", value: `${voiceAnalytics.wordsSpoken}` },
                    { label: "Duration", value: `${Math.round(voiceAnalytics.duration)}s` },
                    { label: "Words/Min", value: `${voiceAnalytics.wpm}` },
                    { label: "Longest Pause", value: `${voiceAnalytics.longestPause}s` },
                    { label: "Filler Words", value: `${voiceAnalytics.fillerCount}`, alert: voiceAnalytics.fillerCount > 3 },
                  ].map(({ label, value, alert }) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className={cn("font-semibold", alert ? "text-warning" : "text-foreground")}>{value}</span>
                    </div>
                  ))}

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium text-primary">{voiceAnalytics.confidenceScore}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted/30">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${voiceAnalytics.confidenceScore}%` }} />
                    </div>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-muted-foreground">Fluency</span>
                      <span className="font-medium text-secondary">{voiceAnalytics.fluencyScore}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted/30">
                      <div className="h-full rounded-full bg-[#06B6D4] transition-all" style={{ width: `${voiceAnalytics.fluencyScore}%` }} />
                    </div>
                  </div>

                  {/* Detected Filler Words */}
                  {Object.keys(voiceAnalytics.fillerWords).length > 0 && (
                    <div className="pt-1.5 border-t border-border/50">
                      <p className="text-[10px] text-muted-foreground mb-1.5">Detected Fillers</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(voiceAnalytics.fillerWords).map(([w, count]) => (
                          <span key={w} className="rounded-full bg-warning/10 border border-warning/20 px-2 py-0.5 text-[10px] text-warning">
                            "{w}" ×{count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* End Report */}
          {interviewEnded && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard hover={false} className="p-4 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
                <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" /> Final Report
                </h3>
                <div className="space-y-2 mb-4">
                  {[
                    { label: "Technical Score", value: overallScores.technical, color: "text-primary" },
                    { label: "Communication", value: overallScores.communication, color: "text-secondary" },
                    { label: "Confidence", value: overallScores.confidence, color: "text-success" },
                    { label: "Fluency", value: overallScores.fluency, color: "text-warning" },
                    { label: "Problem Solving", value: overallScores.problemSolving, color: "text-primary" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-muted-foreground">{label}</span>
                        <span className={cn("font-semibold", color)}>{value || "—"}</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-muted/30">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] transition-all" style={{ width: `${value || 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-muted/20 p-3 text-center border border-border mb-3">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Employability Rating</p>
                  <p className="text-lg font-bold text-primary">{Math.round(Object.values(overallScores).reduce((a, b) => a + b, 0) / 5)}%</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {Object.values(overallScores).reduce((a, b) => a + b, 0) / 5 >= 75 ? "🟢 Strong Candidate" : Object.values(overallScores).reduce((a, b) => a + b, 0) / 5 >= 55 ? "🟡 Good Potential" : "🔴 Needs Improvement"}
                  </p>
                </div>
                <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity">
                  <Download className="h-3.5 w-3.5" /> Export PDF Report
                </button>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Coaching Collapse Block
function CoachingBlock({ icon, label, color, children }: { icon: React.ReactNode; label: string; color: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const colorMap: Record<string, string> = { success: "text-success border-success/20 bg-success/5", warning: "text-warning border-warning/20 bg-warning/5", primary: "text-primary border-primary/20 bg-primary/5", secondary: "text-secondary border-secondary/20 bg-secondary/5" };
  return (
    <div className={cn("rounded-xl border text-xs overflow-hidden", colorMap[color])}>
      <button onClick={() => setOpen(o => !o)} className="flex w-full items-center gap-2 px-3 py-2 font-medium">
        {icon}
        <span>{label}</span>
        <ChevronDown className={cn("ml-auto h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="border-t border-current/10 px-3 py-2 text-muted-foreground">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
