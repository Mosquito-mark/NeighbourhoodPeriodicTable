
import { GoogleGenAI, Type } from "@google/genai";
import { Neighbourhood, AnalysisResponse } from "../types";

/**
 * Uses Gemini 3 Flash to provide a narrative analysis of a selected neighbourhood.
 */
export const analyzeNeighbourhood = async (n: Neighbourhood): Promise<AnalysisResponse> => {
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

    return JSON.parse(response.text || "{}") as AnalysisResponse;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};
