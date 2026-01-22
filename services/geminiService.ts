
import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS } from "../constants";

// Initialize the Google GenAI client with the API key from environment variables.
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartAdvice = async (userPrompt: string) => {
  const ai = getAi();
  
  // Create a structured product context for the AI model to reference.
  const productContext = JSON.stringify(PRODUCTS.map(p => ({
    name: p.name,
    description: p.description,
    features: p.features,
    price: p.price
  })));

  const systemInstruction = `
    You are the Nelbac Smart Advisor. Nelbac is a high-end IoT infrastructure company.
    Your goal is to help customers choose from our professional hardware catalog.
    
    Product Catalog: ${productContext}
    
    Guidelines:
    - Be professional, technical yet accessible, and forward-thinking.
    - Recommend specific products based on the user's needs or environmental problems.
    - If the user is starting a new installation, suggest the Nelbac Controller (NC) as the essential gateway/foundation.
    - Keep responses concise and focused on hardware integration (under 3 sentences).
  `;

  try {
    // Generate content using the Gemini 3 Flash model for efficient and smart reasoning.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // Accessing .text property directly as per the latest SDK guidelines.
    return response.text || "I'm having trouble processing that right now. How can I help you with our IoT solutions?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The neural link is currently unstable. Please try again in a moment.";
  }
};
