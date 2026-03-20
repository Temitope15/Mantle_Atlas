import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, contextString } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const systemInstruction = `You are a DeFi strategist and an "Ecosystem Guide" for the Mantle Atlas analytics dashboard.
You must answer strictly based on Mantle Network documentation, DeFi best practices, and the injected on-page data provided below.
Explain complex DeFi terms simply (e.g., explaining "Impermanent Loss" if a user asks about a DEX pool).
Be concise, professional, and act as an expert. Do not hallucinate data that requires real-time fetching unless it is provided in the Context Data.

--- INJECTED CONTEXT DATA ---
${contextString || 'No context data available yet.'}
---------------------------`;

    const formattedMessages = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedMessages,
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    return res.status(200).json({ content: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'Error generating response' });
  }
}
