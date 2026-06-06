import { create } from "zustand";

interface MetricState {
  resumeScore: number;
  atsScore: number;
  interviewScore: number;
  skillScore: number;
  // Shared resume data — set after upload on Resume Analyzer page
  resumeText: string;
  jobDescription: string;
  history: Array<{
    month: string;
    cri: number;
    resume: number;
    ats: number;
    interview: number;
  }>;
  setScores: (scores: Partial<{ resumeScore: number; atsScore: number; interviewScore: number; skillScore: number }>) => void;
  setResumeData: (resumeText: string, jobDescription: string) => void;
  addHistoryPoint: () => void;
}

const getCurrentMonth = () => {
  return new Date().toLocaleString("default", { month: "short" });
};

export const useMetricsStore = create<MetricState>((set) => ({
  resumeScore: 0,
  atsScore: 0,
  interviewScore: 0,
  skillScore: 0,
  resumeText: "",
  jobDescription: "",
  history: [
    { month: "Jan", cri: 48, resume: 55, ats: 50, interview: 42 },
    { month: "Feb", cri: 54, resume: 60, ats: 55, interview: 48 },
  ],
  setScores: (newScores) =>
    set((state) => ({
      ...state,
      ...newScores,
    })),
  setResumeData: (resumeText, jobDescription) =>
    set({ resumeText, jobDescription }),
  addHistoryPoint: () =>
    set((state) => {
      const cri = Math.round(
        0.3 * state.atsScore +
          0.25 * state.resumeScore +
          0.25 * state.interviewScore +
          0.2 * state.skillScore,
      );
      return {
        history: [
          ...state.history,
          {
            month: getCurrentMonth(),
            cri: isNaN(cri) ? 0 : cri,
            resume: state.resumeScore,
            ats: state.atsScore,
            interview: state.interviewScore,
          },
        ].slice(-6), // keep last 6 months
      };
    }),
}));

export const computeCRIFromStore = (state: MetricState) => {
  return Math.round(
    0.3 * state.atsScore +
      0.25 * state.resumeScore +
      0.25 * state.interviewScore +
      0.2 * state.skillScore,
  );
};
