import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { fetchDocumentContent } from './documentService';
import { findRelevantChunks } from './rag';

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  let API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!API_KEY || API_KEY === "undefined") {
    API_KEY = localStorage.getItem('GEMINI_API_KEY') || '';
  }

  if (!API_KEY) {
    throw new Error("API_KEY_MISSING");
  }

  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: API_KEY });
  }

  return aiInstance;
};

// Cache del documento
let documentContentCache: string | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

const getDocumentContent = async (): Promise<string> => {
  const now = Date.now();

  if (documentContentCache && (now - lastFetchTime) < CACHE_DURATION) {
    return documentContentCache;
  }

  documentContentCache = await fetchDocumentContent();
  lastFetchTime = now;
  return documentContentCache;
};

export const getOperationalAnswer = async (userQuery: string): Promise<string> => {
  try {
    const ai = getAI();

    const documentContent = await getDocumentContent();

    // 🔥 EXTRAER SOLO CONTEXTO RELEVANTE (RAG)
    const relevantContext = findRelevantChunks(documentContent, userQuery);

    const enhancedSystemInstruction = `${SYSTEM_INSTRUCTION}

Responde usando SOLO la información del siguiente contexto del documento.

=== CONTEXTO RELEVANTE ===
${relevantContext}
=== FIN CONTEXTO ===
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // ⚡ modelo rápido
      contents: userQuery,
      config: {
        systemInstruction: enhancedSystemInstruction,
        temperature: 0.2,
      },
    });

    if (!response.text) {
      return "No he podido generar una respuesta. Por favor, intenta de nuevo.";
    }

    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);

    if (error instanceof Error) {
      if (error.message === "API_KEY_MISSING") {
        return "Error: No se ha configurado la API Key de Gemini.";
      }
      return `Error al contactar al servicio: ${error.message}`;
    }

    return "Error desconocido.";
  }
};

export const refreshDocumentCache = async (): Promise<void> => {
  documentContentCache = null;
  lastFetchTime = 0;
  await getDocumentContent();
};
