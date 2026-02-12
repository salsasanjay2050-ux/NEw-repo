
import { GoogleGenAI, Type } from "@google/genai";
import { MLTContent, LanguageStyle } from "./types";

const CONTENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    videoScript: {
      type: Type.OBJECT,
      properties: {
        hook: { type: Type.STRING },
        mainExplanation: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timestamp: { type: Type.STRING },
              content: { type: Type.STRING },
            },
            required: ["timestamp", "content"]
          }
        },
        cta: { type: Type.STRING },
      },
      required: ["hook", "mainExplanation", "cta"]
    },
    imagePrompts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      minItems: 3,
      maxItems: 5
    },
    practiceMCQs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.OBJECT,
            properties: {
              A: { type: Type.STRING },
              B: { type: Type.STRING },
              C: { type: Type.STRING },
              D: { type: Type.STRING },
            },
            required: ["A", "B", "C", "D"]
          },
          correctAnswer: { type: Type.STRING, enum: ["A", "B", "C", "D"] },
          explanation: { type: Type.STRING },
        },
        required: ["question", "options", "correctAnswer", "explanation"]
      },
      minItems: 3,
      maxItems: 3
    },
    onScreenText: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      minItems: 8,
      maxItems: 10
    }
  },
  required: ["videoScript", "imagePrompts", "practiceMCQs", "onScreenText"]
};

export const generateMLTContent = async (topic: string, language: LanguageStyle): Promise<MLTContent> => {
  // Initializing inside the function ensures the API KEY from the environment is captured at call time.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are an expert Medical Laboratory Technology (MLT) Educator for AIIMS CRE and clinical exams in India.
    Your task is to generate educational content for a topic provided by the user.
    
    Language Rules:
    If requested style is 'Hinglish': Use Roman Hindi (Hindi written in English letters) mixed with English technical terms.
    Technical terms (e.g., Gram Staining, RBC, Hematocrit) must always stay in English.
    Example: "Aaj hum discuss karenge Gram Staining ka procedure jo aapke exam point of view se bahut important hai."
    
    Structure the response exactly according to the provided schema.
    The Video Script must be conversational, include timestamps, a strong hook, and a CTA for a 1000+ MCQ e-book.
    Image prompts must be detailed medical illustrations.
    MCQs must be AIIMS/NEET-PG difficulty level.
    On-screen text should be punchy with emojis.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate content for the topic: "${topic}" in ${language} style.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: CONTENT_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate content from Gemini");
  }

  return JSON.parse(text.trim()) as MLTContent;
};
