
import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS } from "../constants";

const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartAdvice = async (userPrompt: string) => {
  const ai = getAi();
  const productContext = JSON.stringify(PRODUCTS.map(p => ({
    name: p.name,
    description: p.description,
    features: p.features,
    price: p.price
  })));

  const systemInstruction = `
    You are the Nelbac Smart Advisor. Nelbac is a high-end IoT infrastructure company.
    Your goal is to help customers choose from our 3 core products: Nelbac Hub X1 (Gateway), Nelbac Node S (Sensor), and Nelbac Link P (Power Controller).
    
    Product Catalog: ${productContext}
    
    Guidelines:
    - Be professional, technical yet accessible, and forward-thinking.
    - Recommend specific products based on the user's problem.
    - If the user is building a new system, suggest the Hub X1 as the foundation.
    - Keep responses concise (under 3 sentences).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I'm having trouble processing that right now. How can I help you with our IoT solutions?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The neural link is currently unstable. Please try again in a moment.";
  }
};
