import { GoogleGenAI } from "@google/genai";

// Ensure API key is available
if (!process.env.API_KEY) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to convert base64 to standard format if needed, though API handles raw base64 data often
const cleanBase64 = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

const getMimeType = (base64: string) => {
  const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  return match ? match[1] : 'image/png';
};

export const editImageWithGemini = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  try {
    const mimeType = getMimeType(base64Image);
    const cleanData = cleanBase64(base64Image);

    // Using gemini-2.5-flash-image as requested for Nano Banana powered app
    const model = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Extract the image from the response
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
            // Reconstruct the base64 data URL
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw error;
  }
};