import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJobDescription = async (title: string, keywords: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Write a professional and engaging job description for a "${title}" role.
      Key requirements/keywords to include: ${keywords}.
      Structure it with an intro, key responsibilities, and required qualifications.
      Keep it under 300 words. Format with simple markdown bullets where appropriate.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please try again.";
  }
};

export const optimizeCoverLetter = async (jobTitle: string, userBio: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Write a short, professional cover letter for a job application for the role of "${jobTitle}".
      Base it on the candidate's background: "${userBio}".
      Keep it concise (under 150 words) and persuasive.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate cover letter.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please try again.";
  }
};