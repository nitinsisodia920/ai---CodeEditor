
import { GoogleGenAI, Type } from "@google/genai";
import { Language, AIAction, AIAuditResult, AIPersona } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askAI(
  prompt: string,
  context: { code: string; language: Language; action: AIAction; persona?: AIPersona }
) {
  const systemInstruction = `You are a ${context.persona || 'Senior Engineer'}.
  Language: ${context.language}
  Current Task: ${context.action}
  Current Code Context:
  \`\`\`${context.language}
  ${context.code}
  \`\`\`
  
  Instructions:
  - If the task is EXPLAIN, provide a clear, line-by-line breakdown.
  - If the task is FIX, find bugs and provide the corrected code.
  - If the task is OPTIMIZE, improve time/space complexity.
  - If the task is GENERATE, provide high-quality implementation.
  - Format code blocks correctly using markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "Error: Could not reach the AI service.";
  }
}

export async function* askAIStream(
  prompt: string,
  context: { code: string; language: Language; action: AIAction; persona?: AIPersona }
) {
  const systemInstruction = `You are a world-class ${context.persona || 'Senior Full-Stack Engineer'}.
  Language: ${context.language}
  Task: ${context.action}
  Code Context:
  \`\`\`${context.language}
  ${context.code}
  \`\`\`
  Respond concisely. Use markdown for code. Focus on professional, production-grade output.`;

  try {
    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("AI Streaming Error:", error);
    yield "Error: Connection to AI core lost.";
  }
}

export async function auditCode(code: string, language: Language): Promise<AIAuditResult> {
  const prompt = `Perform a technical audit of this ${language} code. 
  Return a JSON object with:
  maintainability: (0-100), security: (0-100), performance: (0-100), 
  suggestions: string[] (max 3 critical items).
  Code: ${code}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a code auditor. Return only valid JSON for the specified schema."
      }
    });
    return JSON.parse(response.text || "{}") as AIAuditResult;
  } catch (error) {
    return { maintainability: 0, security: 0, performance: 0, suggestions: ["Audit engine unavailable"] };
  }
}

export async function generateBlueprint(topic: string): Promise<string> {
  const prompt = `Generate a modern architecture blueprint for a project related to: ${topic}. 
  Include folder structure, key technologies, and a 3-step execution roadmap. Use professional Markdown.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an AI Architect. Provide highly visual and structured Markdown blueprints."
      }
    });
    return response.text || "No blueprint generated.";
  } catch (error) {
    return "Failed to generate architecture blueprint.";
  }
}

export async function formatCode(code: string, language: Language): Promise<string> {
  const prompt = `Format this ${language} code. Return ONLY raw code.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0,
        systemInstruction: `You are a raw code formatter. No markdown. No explanations. Only the code.`
      }
    });
    return response.text?.trim() || code;
  } catch (error) {
    return code;
  }
}

export async function simulateMongoQuery(query: string) {
  const prompt = `Execute query and return JSON array of mock data: ${query}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "MongoDB simulator. Return JSON array of documents only."
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return { error: "Failed to simulate query" };
  }
}
