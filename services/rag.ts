const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOP_WORDS = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas",
  "de", "del", "al", "a", "en", "con", "por", "para", "que",
  "es", "son", "se", "no", "si", "y", "o", "pero", "como",
  "cual", "cuando", "donde", "quien", "que", "me", "te", "le",
  "lo", "su", "sus", "mi", "mis", "tu", "tus", "hay", "ser",
  "esta", "este", "esto", "fue", "han", "has", "he", "ya",
]);

const tokenize = (text: string): string[] =>
  normalize(text)
    .split(" ")
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));

export const findRelevantChunks = (doc: string, query: string): string => {
  // Dividir en párrafos y también en bloques de líneas agrupadas
  const lines = doc.split("\n");
  const chunks: string[] = [];

  // Agrupar líneas en bloques de contexto (ventanas de 3 líneas)
  let buffer: string[] = [];
  for (const line of lines) {
    if (line.trim().length > 20) {
      buffer.push(line.trim());
      if (buffer.length >= 3) {
        chunks.push(buffer.join(" "));
        buffer = buffer.slice(1); // ventana deslizante
      }
    } else if (buffer.length > 0) {
      chunks.push(buffer.join(" "));
      buffer = [];
    }
  }
  if (buffer.length > 0) chunks.push(buffer.join(" "));

  // También agregar párrafos completos
  const paragraphs = doc.split(/\n{2,}/).filter(p => p.trim().length > 30);
  const allChunks = [...new Set([...chunks, ...paragraphs])];

  const queryTokens = tokenize(query);
  const queryNorm = normalize(query);

  const scored = allChunks.map(chunk => {
    const chunkNorm = normalize(chunk);
    const chunkTokens = tokenize(chunk);
    let score = 0;

    // Coincidencia exacta de frase completa (máximo peso)
    if (chunkNorm.includes(queryNorm)) score += 20;

    // Coincidencia de tokens individuales
    queryTokens.forEach(term => {
      if (chunkNorm.includes(term)) {
        score += 3;

        // Bonus si aparece varias veces
        const count = (chunkNorm.match(new RegExp(term, "g")) || []).length;
        score += Math.min(count - 1, 3);
      }

      // Coincidencia parcial (el término contiene o está contenido)
      chunkTokens.forEach(chunkToken => {
        if (chunkToken.includes(term) || term.includes(chunkToken)) {
          score += 1;
        }
      });
    });

    // Bonus si el chunk es título o encabezado (corto y con keywords)
    if (chunk.trim().length < 100 && score > 0) score += 2;

    return { text: chunk, score };
  });

  const top = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(s => s.text);

  // Si no hay nada con score > 0, usar inicio del documento como fallback
  if (top.length === 0) {
    return doc.slice(0, 5000);
  }

  // Deduplicar chunks muy similares
  const deduped: string[] = [];
  for (const chunk of top) {
    const isDuplicate = deduped.some(
      existing => normalize(existing).includes(normalize(chunk).slice(0, 50))
    );
    if (!isDuplicate) deduped.push(chunk);
  }

  return deduped.join("\n\n");
};
