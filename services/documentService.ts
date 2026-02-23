// src/services/documentService.ts
const GOOGLE_DOC_ID = '13-QgY_bzNRwearuxcJBoIYhiYO1bByllLCTsSUKYvfo';

export const fetchDocumentContent = async (): Promise<string> => {
  try {
    const exportUrl = `https://docs.google.com/document/d/${GOOGLE_DOC_ID}/export?format=txt`;
    
    const response = await fetch(exportUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el documento: ${response.status}`);
    }

    const content = await response.text();
    
    if (!content || content.trim().length === 0) {
      throw new Error('El documento está vacío o no es accesible públicamente');
    }

    return content;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw new Error('No se pudo acceder al documento de referencia. Asegúrate de que esté configurado como "Cualquier persona con el enlace puede ver".');
  }
};