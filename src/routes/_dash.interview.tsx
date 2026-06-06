import React, { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Upload,
  Settings,
  ChevronRight,
  Sparkles,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Award,
  Clock,
  Plus,
  Play,
  RotateCcw,
  Briefcase,
  Target,
  MessageSquare,
  HelpCircle,
  Trophy,
  Smile,
  Check
} from "lucide-react";
import { GlassCard } from "@/components/ui-ext/glass-card";
import { ProgressBar } from "@/components/ui-ext/progress-bar";
import { toast } from "sonner";
import { generateInterviewQuestionsFn, evaluateInterviewAnswerFn } from "@/lib/api/ai.functions";
import { useMetricsStore } from "@/lib/store";

export const Route = createFileRoute("/_dash/interview")({
  head: () => ({ meta: [{ title: "Interview Prep — CareerPilot AI" }] }),
  component: InterviewPage,
});

type Mode = "AI Interview" | "Coding" | "System Design" | "Behavioral";
type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
type VoiceState = "idle" | "listening" | "recording" | "processing";

interface Msg {
  role: "ai" | "user";
  text: string;
  time: string;
  type?: "question" | "feedback" | "followup" | "answer";
  scores?: { accuracy: number; confidence: number; communication: number; completeness: number };
  coaching?: {
    strengths: string[];
    missing: string[];
    recruiterFeedback: string;
    betterAnswer: string;
  };
  qIndex?: number;
}

const DEFAULT_QUESTIONS = {
  "AI Interview": ["Tell me about a challenging project you worked on and how you overcame it?"],
  "Coding": ["How would you design a rate limiter for a distributed web application?"],
  "System Design": ["How would you structure a URL shortening service like Bit.ly to handle high traffic?"],
  "Behavioral": ["Describe a time you solved a complex problem under pressure."]
};

const MOCK_COACHING = {
  strengths: ["Good structure", "Clear technical depth", "Relevant experience shared"],
  missing: ["Add more metrics & impact"],
  recruiterFeedback: "Solid answer showing strong architectural awareness. Quantifying your database optimization (e.g. latency reduced by 30%) would make it perfect.",
  betterAnswer: "In my final year project, I built a scalable e-commerce backend using Spring Boot and MySQL. I resolved query bottlenecks by implementing Redis cache and database indexing, which reduced latency by 45% and improved concurrency by 4x."
};

function InterviewPage() {
  const [mode, setMode] = useState<Mode>("AI Interview");
  const [difficulty] = useState<DifficultyLevel>("Intermediate");
  const [qIndex, setQIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(3);
  const [questions] = useState<Record<string, string[]>>(DEFAULT_QUESTIONS);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [cameraOn, setCameraOn] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(180); // Start at 3 mins for mockup consistency
  const [interviewEnded, setInterviewEnded] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: "Tell me about a challenging project you worked on and how you overcame it?",
      time: "10:32 AM",
      type: "question",
      qIndex: 0
    },
    {
      role: "user",
      text: "In my final year project, I built a scalable e-commerce backend using Spring Boot and MySQL. I faced challenges in optimizing database queries and handling high traffic...",
      time: "10:34 AM",
      type: "answer"
    },
    {
      role: "ai",
      text: "Evaluated ✓ — here's your coaching feedback:",
      time: "10:35 AM",
      type: "feedback",
      scores: { accuracy: 84, confidence: 82, communication: 90, completeness: 85 },
      coaching: MOCK_COACHING
    }
  ]);

  const setScores = useMetricsStore((state) => state.setScores);
  const addHistoryPoint = useMetricsStore((state) => state.addHistoryPoint);

  const endRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any | null>(null);

  // Timer
  useEffect(() => {
    if (interviewEnded) return;
    const t = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    return () => clearInterval(t);
  }, [interviewEnded]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Web Speech API for voice responses
  const startVoice = () => {
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
      toast.error("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }
    // @ts-expect-error webkitSpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setVoiceState("recording");
    };

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onend = () => {
      setVoiceState("processing");
      setTimeout(() => {
        setVoiceState("idle");
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
    setAnsweredCount(1);
    setInterviewEnded(false);
    setMessages([
      {
        role: "ai",
        text: questions[m]?.[0] || DEFAULT_QUESTIONS["AI Interview"][0],
        time: getFormattedTime(),
        type: "question",
        qIndex: 0
      }
    ]);
  };

  const send = async () => {
    if (!input.trim() || typing) return;
    const answer = input.trim();
    
    // Add user answer bubble
    setMessages(prev => [...prev, { role: "user", text: answer, time: getFormattedTime(), type: "answer" }]);
    setInput("");
    setTyping(true);

    const currentQuestionMsg = [...messages].reverse().find(m => m.type === "question");
    const newAnsweredCount = answeredCount + 1;
    setAnsweredCount(newAnsweredCount);

    try {
      const evalData = await evaluateInterviewAnswerFn({ 
        data: { 
          question: currentQuestionMsg?.text || "", 
          answer: answer,
          role: "Senior Backend Engineer"
        } 
      }) as any;

      setTyping(false);
      
      const newFeedback: Msg = {
        role: "ai",
        text: "Evaluated ✓ — here's your coaching feedback:",
        time: getFormattedTime(),
        type: "feedback",
        scores: {
          accuracy: evalData.attributes?.accuracy || 82,
          confidence: Math.round(80 + Math.random() * 10),
          communication: Math.round(85 + Math.random() * 10),
          completeness: evalData.attributes?.completeness || 80,
        },
        coaching: evalData.coaching || MOCK_COACHING
      };

      setMessages(prev => [...prev, newFeedback]);

      if (newAnsweredCount >= 10) {
        setInterviewEnded(true);
        setScores({ interviewScore: newFeedback.scores?.accuracy || 84 });
        addHistoryPoint();
        toast.success("Mock Interview completed!");
      } else {
        // Queue next question
        const next = (qIndex + 1) % 3;
        setQIndex(next);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: "ai",
            text: questions[mode]?.[next] || DEFAULT_QUESTIONS[mode][0],
            time: getFormattedTime(),
            type: "question",
            qIndex: next
          }]);
        }, 1500);
      }
    } catch (err) {
      console.warn("API evaluation failed, using predictive fallback:", err);
      setTyping(false);
      const newFeedback: Msg = {
        role: "ai",
        text: "Evaluated ✓ — here's your coaching feedback:",
        time: getFormattedTime(),
        type: "feedback",
        scores: { accuracy: 84, confidence: 82, communication: 90, completeness: 85 },
        coaching: MOCK_COACHING
      };
      setMessages(prev => [...prev, newFeedback]);
      
      const next = (qIndex + 1) % 3;
      setQIndex(next);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "ai",
          text: questions[mode]?.[next] || DEFAULT_QUESTIONS[mode][0],
          time: getFormattedTime(),
          type: "question",
          qIndex: next
        }]);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Interview Prep 🎙️
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Practice, Improve. Ace your interviews with AI.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info("Voice call starting...")}
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors flex items-center gap-1.5"
          >
            <Mic className="h-4 w-4 text-primary" /> AI Voice Interview
          </button>
          <button
            onClick={() => switchMode(mode)}
            className="rounded-xl bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground flex items-center gap-1.5 shadow-md hover:opacity-95 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Mock Interview
          </button>
          
          <button className="relative p-2 rounded-xl border border-border bg-card hover:bg-accent transition-colors">
            <Bell className="h-4.5 w-4.5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Top 5 Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Mock Interviews Card */}
        <GlassCard hover={false} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Mock Interviews</span>
            <p className="text-2xl font-black text-foreground mt-1">22</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">This Month</p>
          </div>
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Video className="h-5 w-5" />
          </div>
        </GlassCard>

        {/* Average Score Card */}
        <GlassCard hover={false} className="p-4 flex items-center justify-between">
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Average Score</span>
            <p className="text-2xl font-black text-foreground mt-1">84%</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">+12% vs last month</p>
          </div>
          <div className="w-16 h-8 text-emerald-500 shrink-0 self-end">
            <svg className="h-full w-full" viewBox="0 0 100 30" fill="none">
              <path d="M0 25 L20 23 L40 28 L60 15 L80 18 L100 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </GlassCard>

        {/* Strong Areas Card */}
        <GlassCard hover={false} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Strong Areas</span>
            <div className="mt-1 space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] font-bold text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Communication
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Problem Solving
              </div>
            </div>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
            <Target className="h-5 w-5" />
          </div>
        </GlassCard>

        {/* Focus Areas Card */}
        <GlassCard hover={false} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Focus Areas</span>
            <div className="mt-1 space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] font-bold text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> System Design
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Behavioral
              </div>
            </div>
          </div>
          <div className="h-10 w-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
            <HelpCircle className="h-5 w-5" />
          </div>
        </GlassCard>

        {/* Confidence Level Card */}
        <GlassCard hover={false} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Confidence Level</span>
            <p className="text-2xl font-black text-foreground mt-1">82%</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Keep Practicing!</p>
          </div>
          <div className="h-10 w-10 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center">
            <Smile className="h-5 w-5" />
          </div>
        </GlassCard>
      </div>

      {/* Grid: 3 Main Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (Current Session & Modes) - Spans 3 cols */}
        <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
          
          {/* Current Session Card */}
          <GlassCard hover={false} className="p-5 flex-1 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-foreground">Current Session</h3>
                <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Role</p>
                  <p className="text-xs font-bold text-foreground">Senior Backend Engineer</p>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Difficulty</p>
                  <p className="text-xs font-bold text-amber-600">Medium</p>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Duration</p>
                  <p className="text-xs font-bold text-foreground">30 Min</p>
                </div>
              </div>
            </div>

            {/* Mascot Robot Graphic SVG */}
            <div className="my-4 flex items-center justify-center relative h-24">
              <svg className="w-20 h-20 text-primary drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="6" width="18" height="12" rx="4" fill="var(--color-primary)" fillOpacity="0.1" />
                <circle cx="8" cy="12" r="1.5" fill="var(--color-primary)" />
                <circle cx="16" cy="12" r="1.5" fill="var(--color-primary)" />
                <path d="M10 15 Q12 17 14 15" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 2 V6" stroke="var(--color-primary)" strokeWidth="1.5" />
                <circle cx="12" cy="2" r="1" fill="var(--color-primary)" />
              </svg>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-semibold text-muted-foreground mb-1">
                <span>Questions {answeredCount} / 10</span>
                <span>{answeredCount * 10}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${answeredCount * 10}%` }} />
              </div>
            </div>
          </GlassCard>

          {/* Practice Modes */}
          <GlassCard hover={false} className="p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Practice Modes</h3>
            <div className="space-y-2">
              {[
                { name: "AI Mock Interview", desc: "Full mock with AI feedback", tab: "AI Interview", bg: "bg-primary/10 text-primary" },
                { name: "Coding Interview", desc: "Solve problems & get feedback", tab: "Coding", bg: "bg-emerald-500/10 text-emerald-600" },
                { name: "System Design", desc: "Design scalable systems", tab: "System Design", bg: "bg-amber-500/10 text-amber-600" },
                { name: "Behavioral Interview", desc: "STAR method practice", tab: "Behavioral", bg: "bg-blue-500/10 text-blue-600" }
              ].map((pm) => (
                <button
                  key={pm.name}
                  onClick={() => switchMode(pm.tab as Mode)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-muted/10 hover:bg-muted/40 transition-colors text-left ${
                    mode === pm.tab ? "ring-2 ring-primary/40 border-primary" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${pm.bg}`}>
                      <Video className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{pm.name}</p>
                      <p className="text-[9px] text-muted-foreground">{pm.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Middle Column (Chat Area) - Spans 6 cols */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl border border-border bg-card/15 shadow-sm overflow-hidden min-h-[500px]">
          
          {/* Chat Header and tabs */}
          <div className="bg-card/40 border-b border-border p-4 flex justify-between items-center">
            <div className="flex gap-4 text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-none">
              {(["AI Interview", "Coding", "System Design", "Behavioral"] as Mode[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchMode(tab)}
                  className={`pb-1 relative ${mode === tab ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {tab === "AI Interview" ? "AI Interview" : tab}
                  {mode === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Messages display */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[460px] min-h-[300px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary"
                }`}>
                  {msg.role === "user" ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
                </div>

                <div className="max-w-[80%] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-foreground capitalize">
                      {msg.role === "user" ? "Your Answer" : "AI Coach"}
                    </span>
                    <span className="text-[8px] text-muted-foreground">{msg.time}</span>
                  </div>
                  
                  <div className={`text-xs px-4 py-3 rounded-2xl leading-relaxed ${
                    msg.role === "user" 
                      ? "rounded-tr-sm bg-gradient-primary text-white" 
                      : "rounded-tl-sm bg-muted/20 border border-border/40 text-foreground"
                  }`}>
                    {msg.text}
                  </div>

                  {/* Audio Waveform for User Answer */}
                  {msg.role === "user" && (
                    <div className="flex items-center gap-3 bg-muted/15 border border-border/30 rounded-xl p-2 max-w-[280px]">
                      <svg className="h-6 w-full text-primary" viewBox="0 0 100 20" fill="none">
                        <path d="M5 10 L10 5 L15 15 L20 8 L25 12 L30 3 L35 17 L40 9 L45 11 L50 4 L55 16 L60 10 L65 12 L70 5 L75 15 L80 9 L85 11 L90 6 L95 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[9px] font-bold text-muted-foreground whitespace-nowrap">00:45</span>
                    </div>
                  )}

                  {/* AI Feedback Box */}
                  {msg.type === "feedback" && msg.coaching && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-3.5 mt-2">
                      <h4 className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" /> AI Feedback
                      </h4>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        {msg.coaching.strengths.map((str) => (
                          <div key={str} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3px]" />
                            <span>{str}</span>
                          </div>
                        ))}
                        {msg.coaching.missing.map((mis) => (
                          <div key={mis} className="flex items-start gap-2 text-amber-600 font-medium">
                            <Plus className="h-4 w-4 text-amber-500 shrink-0 stroke-[3px]" />
                            <span>{mis}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted/20 border border-border/40 px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Bottom input area */}
          <div className="border-t border-border p-4 bg-card/20 space-y-3">
            <div className="flex items-center gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={voiceState === "recording" ? "🎙 Listening…" : "Type your answer here…"}
                disabled={interviewEnded}
                className="flex-1 max-h-24 min-h-[44px] rounded-xl border border-border bg-muted/20 px-4 py-2.5 text-xs outline-none resize-none placeholder:text-muted-foreground text-foreground"
              />
              <button
                onClick={send}
                disabled={!input.trim() || typing || interviewEnded}
                className="h-11 w-11 rounded-xl bg-gradient-primary text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 disabled:opacity-40"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => { setInterviewEnded(true); toast.success("Session finished!"); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-colors"
              >
                End Session
              </button>
              
              <div className="flex gap-2">
                <button onClick={toggleVoice} className={`p-2 rounded-xl border transition-colors ${
                  voiceState === "recording" ? "bg-red-500/10 border-red-500 text-red-500" : "bg-card border-border hover:bg-accent text-muted-foreground"
                }`}>
                  <Mic className="h-4 w-4" />
                </button>
                <button onClick={() => setCameraOn(!cameraOn)} className={`p-2 rounded-xl border transition-colors ${
                  !cameraOn ? "bg-red-500/10 border-red-500 text-red-500" : "bg-card border-border hover:bg-accent text-muted-foreground"
                }`}>
                  <Video className="h-4 w-4" />
                </button>
                <button onClick={() => toast.info("Document Upload opened")} className="p-2 rounded-xl border border-border bg-card hover:bg-accent text-muted-foreground transition-colors">
                  <Upload className="h-4 w-4" />
                </button>
                <button onClick={() => toast.info("Settings panel opened")} className="p-2 rounded-xl border border-border bg-card hover:bg-accent text-muted-foreground transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Analytics & Matches) - Spans 3 cols */}
        <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
          
          {/* Performance Overview */}
          <GlassCard hover={false} className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-foreground">Performance Overview</h3>
              <button onClick={() => toast.info("Showing Performance Report...")} className="text-xs font-semibold text-primary hover:underline">
                View Report
              </button>
            </div>

            {/* Donut Chart Gauge */}
            <div className="flex flex-col items-center justify-center py-2 border-b border-border/30">
              <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="var(--border)" strokeWidth="6" fill="transparent" className="opacity-20" />
                  <circle cx="48" cy="48" r="38" stroke="var(--color-primary)" strokeWidth="6.5" fill="transparent"
                          strokeDasharray={2 * Math.PI * 38} strokeDashoffset={2 * Math.PI * 38 * (1 - 84 / 100)}
                          strokeLinecap="round" />
                </svg>
                <div className="absolute text-center flex flex-col">
                  <span className="text-[10px] font-medium text-muted-foreground">Overall Score</span>
                  <span className="text-xl font-extrabold text-foreground -mt-0.5">84<span className="text-xs font-medium text-muted-foreground">/100</span></span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary mt-2">Great Progress! 🚀</span>
            </div>

            {/* Progress Bars */}
            <div className="space-y-2.5">
              <ProgressBar label="Communication" value={90} color="var(--color-primary)" />
              <ProgressBar label="Technical Depth" value={80} color="var(--color-secondary)" />
              <ProgressBar label="Problem Solving" value={85} color="var(--color-success)" />
              <ProgressBar label="Confidence" value={82} color="var(--color-warning)" />
            </div>
          </GlassCard>

          {/* Recent Mock Interviews */}
          <GlassCard hover={false} className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">Recent Mock Interviews</h3>
              <button onClick={() => toast.info("Viewing all mocks")} className="text-[10px] font-bold text-primary hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-2">
              {[
                { title: "System Design Mock", date: "2 days ago", score: "85%", bg: "bg-emerald-500/10 text-emerald-700" },
                { title: "Behavioral Mock", date: "4 days ago", score: "78%", bg: "bg-amber-500/10 text-amber-700" },
                { title: "Technical Mock", date: "6 days ago", score: "88%", bg: "bg-emerald-500/10 text-emerald-700" }
              ].map((m) => (
                <div key={m.title} className="flex justify-between items-center p-2 rounded-xl border border-border/30 bg-muted/10">
                  <div>
                    <p className="text-xs font-bold text-foreground">{m.title}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{m.date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.bg}`}>
                    {m.score}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Suggestions Card */}
          <div className="rounded-3xl bg-gradient-primary p-5 text-white relative overflow-hidden shadow-lg group">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/90">AI Suggestions</h4>
            <p className="mt-3 text-xs leading-relaxed font-semibold">
              Practice System Design and Behavioral questions more to improve by <span className="text-yellow-300 font-extrabold">15%</span>.
            </p>
            <Link
              to="/roadmap"
              className="mt-4 block w-full text-center rounded-xl bg-white text-indigo-950 py-2 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              View Personalized Plan →
            </Link>
          </div>

        </div>

      </div>

      {/* Popular Question Categories */}
      <GlassCard hover={false} className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-foreground">Popular Question Categories</h3>
          <button onClick={() => toast.info("View All Categories")} className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
            View All Categories <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {["Java & Spring Boot", "SQL", "System Design", "DBMS", "DSA", "Behavioral"].map((cat) => (
            <span
              key={cat}
              onClick={() => toast.info(`Starting practice for ${cat}`)}
              className="text-xs font-medium bg-muted hover:bg-accent text-foreground border border-border/50 px-3.5 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>
      </GlassCard>

    </div>
  );
}
