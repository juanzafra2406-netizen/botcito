const GOOGLE_DOC_ID = '13-QgY_bzNRwearuxcJBoIYhiYO1bByllLCTsSUKYvfo';

const extractTextWithLinks = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tag = el.tagName.toLowerCase();

      // Convertir links a formato markdown [texto](url)
      if (tag === 'a') {
        const href = el.getAttribute('href') || '';
        const text = el.textContent || '';
        if (href && text && href !== text) {
          return `[${text.trim()}](${href})`;
        }
        return text;
      }

      // Saltos de línea para bloques
      const blockTags = ['p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'tr'];
      const children = Array.from(node.childNodes).map(processNode).join('');

      if (blockTags.includes(tag)) {
        return children + '\n';
      }

      return children;
    }

    return '';
  };

  const body = doc.body;
  const text = processNode(body);

  // Limpiar líneas vacías múltiples
  return text.replace(/\n{3,}/g, '\n\n').trim();
};

export const fetchDocumentContent = async (): Promise<string> => {
  try {
    const exportUrl = `https://docs.google.com/document/d/${GOOGLE_DOC_ID}/export?format=html`;

    const response = await fetch(exportUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el documento: ${response.status}`);
    }

    const html = await response.text();
    const content = extractTextWithLinks(html);

    if (!content || content.trim().length === 0) {
      throw new Error('El documento está vacío o no es accesible públicamente');
    }

    return content;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw new Error('No se pudo acceder al documento de referencia. Asegúrate de que esté configurado como "Cualquier persona con el enlace puede ver".');
  }
};
