
import { GoogleGenAI, Type } from "@google/genai";
import { Neighbourhood, AnalysisResponse } from "../types";

const CACHE_PREFIX = "ed_nb_analysis_v1_";

/**
 * Helper to fetch from LocalStorage cache
 */
const getCachedAnalysis = (id: string): AnalysisResponse | null => {
  const cached = localStorage.getItem(CACHE_PREFIX + id);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * Helper to save to LocalStorage cache
 */
const setCachedAnalysis = (id: string, data: AnalysisResponse) => {
  localStorage.setItem(CACHE_PREFIX + id, JSON.stringify(data));
};

/**
 * Sleep utility for backoff
 */
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Uses Gemini 3 Flash to provide a narrative analysis.
 * Features:
 * 1. Caching: Avoids hitting the API for already analyzed neighborhoods.
 * 2. Retries: Handles 429 errors with exponential backoff.
 */
export const analyzeNeighbourhood = async (
  n: Neighbourhood,
  retries = 2,
  backoff = 1000
): Promise<AnalysisResponse> => {
  // 1. Check Cache First
  const cached = getCachedAnalysis(n.id);
  if (cached) return cached;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this Edmonton neighbourhood:
    - Name: ${n.name}
    - Ward: ${n.ward}
    - Population: ${n.population}
    - Households: ${n.households}
    - Median Income: $${n.medianIncome}
    - Median Home Price: $${n.medianHomePrice}
    - Affordability Ratio: ${n.affordabilityRatio} (Lower is more affordable)
    - Active Transport (Sustainable Mode %): ${n.sustainableModePct}%
    
    Provide a professional demographic and real estate summary for someone considering moving here.
    Also highlight 3 key unique points about its socio-economic standing in the city.
    Conclude with a specific recommendation based on its stats.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A 2-3 sentence overview." },
            keyHighlights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Three bullet points about unique characteristics."
            },
            recommendation: { type: Type.STRING, description: "Final verdict." }
          },
          required: ["summary", "keyHighlights", "recommendation"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}") as AnalysisResponse;
    
    // 2. Cache the successful result
    setCachedAnalysis(n.id, result);
    
    return result;
  } catch (error: any) {
    // 3. Handle 429 specifically with retries
    if (error?.message?.includes("429") || error?.status === 429) {
      if (retries > 0) {
        console.warn(`Gemini Rate Limited. Retrying in ${backoff}ms...`);
        await sleep(backoff);
        return analyzeNeighbourhood(n, retries - 1, backoff * 2);
      }
      throw new Error("QUOTA_EXHAUSTED");
    }

    console.error("Gemini analysis failed:", error);
    throw error;
  }
};
