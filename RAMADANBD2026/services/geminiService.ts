
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const FALLBACK_QUOTES = [
  { text: "রমজান হলো নিজেকে পরিবর্তনের শ্রেষ্ঠ মাস।", reference: "আল-হাদিস" },
  { text: "যে ব্যক্তি ঈমানের সাথে ও সওয়াবের আশায় রমজানের রোজা রাখে, তার অতীতের সব গুনাহ ক্ষমা করে দেওয়া হয়।", reference: "সহীহ বুখারী" },
  { text: "রোজা ঢাল স্বরূপ, সুতরাং রোজা রেখে কেউ যেন অশ্লীল কথা না বলে এবং জাহেলী আচরণ না করে।", reference: "সহীহ মুসলিম" },
  { text: "তোমাদের মধ্যে সেই ব্যক্তিই উত্তম যে কুরআন শিক্ষা করে এবং অন্যকে শিক্ষা দেয়।", reference: "সহীহ বুখারী" },
  { text: "নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে।", reference: "সূরা আশ-শারহ: ৬" }
];

async function fetchWithRetry<T>(fn: () => Promise<T>, maxRetries = 2, initialDelay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error?.message?.includes('429') || error?.status === 429 || JSON.stringify(error).includes('429');
      if (isRateLimit && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(2, i)));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export const getDailyIslamicInspiration = async () => {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `islamic_inspiration_${today}`;
  
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) { localStorage.removeItem(cacheKey); }
  }

  if (!process.env.API_KEY || process.env.API_KEY === "API_KEY") {
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await fetchWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Give a short, beautiful Islamic quote or Hadith for Ramadan preparation in Bengali. Format as JSON: { text: string, reference: string }",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            reference: { type: Type.STRING }
          },
          required: ["text", "reference"]
        }
      }
    }));
    
    const result = JSON.parse(response.text?.trim() || "{}");
    if (result.text) {
      localStorage.setItem(cacheKey, JSON.stringify(result));
      return result;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.warn("Using fallback quote due to API limit or error.");
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  }
};

export const askIslamicAssistant = async (question: string) => {
  if (!process.env.API_KEY || process.env.API_KEY === "API_KEY") {
    return "দুঃখিত, এআই ফিচারটি সক্রিয় করার জন্য একটি বৈধ API Key প্রয়োজন।";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await fetchWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `একজন ইসলামি জ্ঞানসম্পন্ন সহকারী হিসেবে বাংলায় উত্তর দিন: ${question}`,
      config: {
        systemInstruction: "You are a helpful Islamic assistant. Always answer politely in Bengali. Base answers on Quran and Sunnah."
      }
    }));
    return response.text || "আমি উত্তর দিতে পারছি না।";
  } catch (error: any) {
    if (JSON.stringify(error).includes('429')) {
      return "দুঃখিত, বর্তমানে সার্ভারে কোটা শেষ হয়ে গেছে। দয়া করে কিছুক্ষণ পর চেষ্টা করুন।";
    }
    return "দুঃখিত, বর্তমানে সিস্টেমে কিছু সমস্যা হচ্ছে।";
  }
};
