
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Helper for exponential backoff retry logic
async function fetchWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error?.message?.includes('429') || error?.status === 429 || JSON.stringify(error).includes('429');
      
      if (isRateLimit && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Gemini API rate limited. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export const getDailyIslamicInspiration = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Fix: Explicitly type fetchWithRetry and handle potential undefined text property from GenerateContentResponse
    const response = await fetchWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "একজন মুসলিমের জন্য রমজানের প্রস্তুতির জন্য একটি ছোট সুন্দর অনুপ্রেরণামূলক আয়াত বা হাদিস দিন (বাংলায়)। format should be JSON: { text: string, reference: string }",
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
    return JSON.parse(response.text?.trim() || "{}");
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      text: "রমজান হলো নিজেকে পরিবর্তনের শ্রেষ্ঠ মাস।",
      reference: "সংক্ষিপ্ত উপদেশ"
    };
  }
};

export const askIslamicAssistant = async (question: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Fix: Explicitly type fetchWithRetry and upgrade model to gemini-3-pro-preview for complex reasoning/knowledge tasks
    const response = await fetchWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `একজন ইসলামি জ্ঞানসম্পন্ন সহকারী হিসেবে নিচের প্রশ্নের উত্তর দিন। উত্তরটি অবশ্যই নম্র ও সহমর্মী হতে হবে। প্রশ্ন: ${question}`,
      config: {
        systemInstruction: "You are a friendly and knowledgeable Islamic assistant. Answer in Bengali. Provide accurate information based on Quran and Sunnah."
      }
    }));
    return response.text || "";
  } catch (error) {
    console.error("Assistant API Error:", error);
    if (JSON.stringify(error).includes('429')) {
      return "দুঃখিত, বর্তমানে আমাদের সার্ভারে অত্যাধিক চাপ রয়েছে (কোটা শেষ)। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।";
    }
    return "দুঃখিত, বর্তমানে আমাদের এআই সিস্টেমে কিছু সমস্যা হচ্ছে। অনুগ্রহ করে পরে চেষ্টা করুন।";
  }
};
