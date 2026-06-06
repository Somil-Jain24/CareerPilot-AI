import Groq from "groq-sdk";

export function getGroqClient() {
  // In TanStack Start server functions, process.env is available server-side.
  // VITE_* variables are also injected into process.env by Vite during dev.
  const apiKey = process.env.VITE_GROQ_API_KEY || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GROQ_API_KEY : undefined);

  if (!apiKey) {
    throw new Error(
      "Missing VITE_GROQ_API_KEY environment variable. Please add it to your .env file."
    );
  }

  // Create a fresh client per call — safe for serverless/edge environments
  // where module-level singletons may not persist across requests.
  return new Groq({ apiKey });
}

export const MODEL = "llama-3.3-70b-versatile";

