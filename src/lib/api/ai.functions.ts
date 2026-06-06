import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getGroqClient, MODEL } from "./groq.server";

// Resume Analysis Function
export const analyzeResumeFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ resumeText: z.string().min(10), jobDescription: z.string().optional() }))
  .handler(async ({ data }) => {
    try {
      const groq = getGroqClient();
      const prompt = `You are an expert technical recruiter and resume analyzer.
      Parse the following resume and extract the key information in JSON format.
      Provide actionable feedback, identify missing skills (especially for modern tech stacks), and extract core strengths.
      Respond ONLY with valid JSON. Do not wrap in markdown tags like \`\`\`json.
      
      Expected JSON schema:
      {
        "overall": number (0-100),
        "ats": number (0-100),
        "technical": number (0-100),
        "soft": number (0-100),
        "experience": number (0-100),
        "education": number (0-100),
        "matchingSkills": ["string"],
        "missingSkills": ["string"],
        "missingKeywords": ["string"],
        "resumeImprovements": ["string"],
        "atsRecommendations": ["string"],
        "skillGapAnalysis": "string"
      }

      Resume Text:
      ${data.resumeText}
      
      Job Description (if provided, match against this):
      ${data.jobDescription || "General industry standards"}
      `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: MODEL,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
      return result;
    } catch (err: any) {
      console.error("GROQ API ERROR in analyzeResumeFn:", err);
      throw err;
    }
  });

// ATS Analysis Function
export const analyzeATSFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ resumeText: z.string().min(10), jobDescription: z.string().optional() }))
  .handler(async ({ data }) => {
    const groq = getGroqClient();
    const prompt = `You are an ATS (Applicant Tracking System) simulator.
    Analyze the following resume against common ATS constraints. If a job description is provided, also check keyword match.
    Respond ONLY with valid JSON. Do not wrap in markdown tags like \`\`\`json.

    Expected JSON schema:
    {
      "atsScore": number (0-100),
      "keywordDensity": [{ "keyword": "string", "count": number }],
      "atsIssues": [{ "title": "string", "desc": "string", "severity": "error" | "warning" }],
      "atsCompliant": [{ "title": "string", "desc": "string" }],
      "keywordGaps": ["string"]
    }

    Job Description: ${data.jobDescription || "Not provided (evaluate general ATS best practices)"}
    Resume Text:
    ${data.resumeText}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  });

// Job Match Analysis Function
export const analyzeJobMatchFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ resumeText: z.string().min(10), jobDescription: z.string().min(10) }))
  .handler(async ({ data }) => {
    const groq = getGroqClient();
    const prompt = `You are a career matchmaker AI.
    Evaluate the match between the resume and the job description.
    Respond ONLY with valid JSON. Do not wrap in markdown tags like \`\`\`json.

    Expected JSON schema:
    {
      "matchScore": number (0-100),
      "matchBreakdown": [
        { "label": "Technical Skills", "value": number, "color": "var(--color-primary)" },
        { "label": "Soft Skills", "value": number, "color": "var(--color-secondary)" },
        { "label": "Experience", "value": number, "color": "var(--color-warning)" },
        { "label": "Education", "value": number, "color": "var(--color-success)" }
      ],
      "skillsFound": ["string"],
      "skillsMissing": ["string"],
      "keywordGaps": ["string"],
      "recommendations": ["string"]
    }

    Job Description:
    ${data.jobDescription}

    Resume Text:
    ${data.resumeText}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  });

// Roadmap Generation Function
export const generateRoadmapFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ skillsMissing: z.array(z.string()), careerGoal: z.string().optional() }))
  .handler(async ({ data }) => {
    const groq = getGroqClient();
    const prompt = `You are a technical mentor.
    Create a 4-week learning roadmap to cover the following missing skills for the career goal.
    Respond ONLY with valid JSON. Do not wrap in markdown tags like \`\`\`json.

    Expected JSON schema:
    {
      "roadmap": [
        {
          "week": "string (e.g. Week 1)",
          "title": "string",
          "topics": ["string"],
          "goals": ["string"],
          "projects": ["string"]
        }
      ]
    }

    Career Goal: ${data.careerGoal || "Software Engineer"}
    Missing Skills: ${data.skillsMissing.join(", ")}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  });

// Learning Resources Function
export const fetchLearningResourcesFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ skills: z.array(z.string()) }))
  .handler(async ({ data }) => {
    const groq = getGroqClient();
    const prompt = `Recommend 6-8 high-quality, real-world learning resources for the following skills.
    Use real platforms like Coursera, YouTube, Udemy, Official Docs, LeetCode, etc.
    Respond ONLY with valid JSON. Do not wrap in markdown tags like \`\`\`json.

    Expected JSON schema:
    {
      "resources": [
        {
          "title": "string",
          "platform": "string",
          "type": "Courses" | "YouTube" | "Documentation" | "Practice Platforms",
          "level": "Beginner" | "Intermediate" | "Advanced",
          "skill": "string",
          "desc": "string"
        }
      ]
    }

    Skills to learn: ${data.skills.join(", ")}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  });

// Generate Interview Questions
export const generateInterviewQuestionsFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ role: z.string(), experienceLevel: z.string().optional() }))
  .handler(async ({ data }) => {
    const groq = getGroqClient();
    const prompt = `You are a technical interviewer for a ${data.experienceLevel || "mid-level"} ${data.role} role.
    Generate 3 distinct questions for each of the following categories: Technical, HR, and Scenario-based.
    Respond ONLY with valid JSON. Do not wrap in markdown tags like \`\`\`json.

    Expected JSON schema:
    {
      "Technical": ["string"],
      "HR": ["string"],
      "Scenario": ["string"]
    }
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  });

// Evaluate Interview Answer
export const evaluateInterviewAnswerFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ question: z.string(), answer: z.string(), role: z.string().optional() }))
  .handler(async ({ data }) => {
    const groq = getGroqClient();
    const prompt = `You are evaluating a candidate's answer to an interview question for the role of ${data.role || "Software Engineer"}.
    Provide constructive feedback and score the answer on multiple attributes.
    Respond ONLY with valid JSON. Do not wrap in markdown tags like \`\`\`json.

    Expected JSON schema:
    {
      "attributes": {
        "accuracy": number (0-100),
        "completeness": number (0-100)
      },
      "coaching": {
        "strengths": ["string"],
        "missing": ["string"],
        "recruiterFeedback": "string",
        "betterAnswer": "string",
        "starFeedback": "string",
        "communicationFeedback": "string"
      }
    }

    Question: ${data.question}
    Answer: ${data.answer}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  });

// LinkedIn Optimization Function
export const optimizeLinkedInFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ profileData: z.string(), targetRole: z.string().optional() }))
  .handler(async ({ data }) => {
    try {
      const groq = getGroqClient();
      const prompt = `You are a LinkedIn profile optimization expert.
      Analyze the provided background data (Resume or current LinkedIn text) and return specific, actionable suggestions to optimize their LinkedIn profile for recruiters.
      ${data.targetRole ? `\nTarget Role / Job Description:\n${data.targetRole}\n` : ""}
      
      Respond ONLY with valid JSON. Do not wrap in markdown tags like \`\`\`json.

      Expected JSON schema:
      {
        "score": number (0-100),
        "headlineSuggestions": ["string"],
        "summaryImprovements": ["string"],
        "skillRecommendations": ["string"]
      }

      Background Data (Resume/Profile):
      ${data.profileData}
      `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: MODEL,
        response_format: { type: "json_object" },
      });

      return JSON.parse(completion.choices[0]?.message?.content || "{}");
    } catch (err: any) {
      console.error("GROQ API ERROR in optimizeLinkedInFn:", err);
      throw err;
    }
  });

// Recruiter Snapshot Generation Function
export const generateRecruiterViewFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ resumeText: z.string().min(10) }))
  .handler(async ({ data }) => {
    const groq = getGroqClient();
    const prompt = `You are a Senior Technical Recruiter.
    Evaluate the following resume and provide a candid, objective hiring recommendation.
    Also, analyze the skills (e.g. Java, React) and determine which job roles or fields the candidate is highly eligible for.
    Respond ONLY with valid JSON. Do not wrap in markdown tags like \`\`\`json.

    Expected JSON schema:
    {
      "fit": "Strong Fit" | "Moderate Fit" | "Weak Fit",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "recommendation": "string",
      "eligibleJobs": [
        { "title": "string (e.g. Java Developer)", "reason": "string (e.g. Based on your 3 years of Java and Spring Boot experience)" }
      ]
    }

    Resume Text:
    ${data.resumeText}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  });
