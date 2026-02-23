
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { fetchDocumentContent } from './documentService';
import { findRelevantChunks } from './rag';

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  let API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  // Si no hay key en el ambiente, buscamos en localStorage
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

// Cache del documento para no hacer fetch en cada pregunta
let documentContentCache: string | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const getDocumentContent = async (): Promise<string> => {
  const now = Date.now();
  
  // Si tenemos cache válido, usarlo
  if (documentContentCache && (now - lastFetchTime) < CACHE_DURATION) {
    return documentContentCache;
  }

  // Si no, obtener contenido fresco
  documentContentCache = await fetchDocumentContent();
  lastFetchTime = now;
  return documentContentCache;
};

export const getOperationalAnswer = async (userQuery: string): Promise<string> => {
  try {
    const ai = getAI();
    // Obtener el contenido del documento
    const documentContent = await getDocumentContent();
    
    // Crear la instrucción del sistema que incluye el documento
    const enhancedSystemInstruction = `${SYSTEM_INSTRUCTION}

A continuación se encuentra el documento de procesos operativos. Basa TODAS tus respuestas exclusivamente en él.

=== DOCUMENTO DE PROCESOS OPERATIVOS ===
${documentContent}
=== FIN DEL DOCUMENTO ===
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
        return "Error: No se ha configurado la API Key de Gemini. Por favor, conéctala en la pantalla de inicio.";
      }
      return `Error al contactar al servicio de asistencia: ${error.message}`;
    }
    return "Ocurrió un error desconocido. Por favor, verifica la consola para más detalles.";
  }
};

// Función para forzar actualización del cache (útil para testing)
export const refreshDocumentCache = async (): Promise<void> => {
  documentContentCache = null;
  lastFetchTime = 0;
  await getDocumentContent();
};
