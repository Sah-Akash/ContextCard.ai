import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Deck, Flashcard, PracticeQuestion } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FLASHCARD_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A short, catchy title for the study deck." },
    summary: { type: Type.STRING, description: "A concise summary of the uploaded material." },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING, description: "The question or concept on the front of the card." },
          back: { type: Type.STRING, description: "The answer or explanation on the back of the card." },
        },
        required: ["front", "back"],
      },
    },
  },
  required: ["title", "summary", "flashcards"],
};

const QUIZ_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["question", "options", "correctAnswer", "explanation"]
      }
    }
  },
  required: ["questions"]
};

export const generateStudyMaterial = async (
  base64Data: string,
  mimeType: string
): Promise<Omit<Deck, 'id' | 'createdAt'>> => {
  try {
    const model = "gemini-3-flash-preview"; 

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `You are an expert educational content developer. Analyze the source material and generate exam-ready study materials.
            
            Constraints:
            * Source Truth: Derived strictly from provided material.
            * Format: Output strictly valid JSON.
            * Pedagogy: 40% Recall, 40% Application, 20% Synthesis.
            
            Generate a title, a brief summary, and a list of flashcards.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: FLASHCARD_SCHEMA,
        systemInstruction: "You are a helpful study companion focused on accuracy and retention.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text);

    return {
      title: data.title || "Untitled Deck",
      summary: data.summary || "No summary provided.",
      cards: data.flashcards.map((c: any) => ({
        front: c.front,
        back: c.back,
        masteryLevel: 0,
      })),
    };
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const generatePracticeQuiz = async (topic: string): Promise<PracticeQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a unique 10-question practice quiz for the topic: "${topic}". 
      Include detailed explanations for the correct answer.
      Ensure the difficulty is appropriate for a professional exam certification.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: QUIZ_SCHEMA,
        systemInstruction: "You are a strict exam proctor generating high-quality practice questions.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    const data = JSON.parse(text);
    return data.questions || [];
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    throw error;
  }
};

export const generateCheatSheet = async (deckTitle: string, cards: Flashcard[]): Promise<string> => {
  try {
    const contentContext = cards.map(c => `Q: ${c.front}\nA: ${c.back}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a concise, high-yield 'Cheat Sheet' or 'Quick Reference Guide' based on the following flashcards. 
      Topic: ${deckTitle}
      
      Format: Markdown. Use headers, bullet points, and bold text for key terms.
      
      Content:
      ${contentContext.substring(0, 10000)}`, // Limit context size
      config: {
        systemInstruction: "You are an expert tutor creating study guides.",
      },
    });

    return response.text || "Could not generate cheat sheet.";
  } catch (error) {
    console.error("Cheat Sheet Error:", error);
    return "Failed to generate cheat sheet. Please try again.";
  }
};