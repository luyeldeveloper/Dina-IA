
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeChart(
  base64Image: string,
  templatePrompt: string
): Promise<Partial<AnalysisResult>> {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `You are Dina IA, a world-class financial technical analyst. 
  Your goal is to provide structured, actionable analysis of trading charts. 
  Always use the provided JSON schema for responses.
  Base your analysis strictly on visible data in the image. 
  Address patterns (like Head & Shoulders, Flags), Indicators (RSI, MACD, MA), and Volume spikes.
  Ensure the response is in Portuguese (Portugal).`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } },
        { text: templatePrompt }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: {
            type: Type.OBJECT,
            properties: {
              confidenceScore: { type: Type.NUMBER },
              trendDirection: { type: Type.STRING, enum: ['Bullish', 'Bearish', 'Neutral'] },
              volatility: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              volume: { type: Type.STRING }
            },
            required: ['confidenceScore', 'trendDirection', 'volatility', 'volume']
          },
          details: {
            type: Type.OBJECT,
            properties: {
              patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
              signals: { type: Type.ARRAY, items: { type: Type.STRING } },
              indicators: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    insight: { type: Type.STRING }
                  },
                  required: ['name', 'insight']
                }
              },
              actionPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['patterns', 'signals', 'indicators', 'actionPoints']
          },
          recommendation: { type: Type.STRING }
        },
        required: ['title', 'summary', 'details', 'recommendation']
      }
    }
  });

  const data = JSON.parse(response.text);
  return data;
}
