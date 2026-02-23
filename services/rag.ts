export const findRelevantChunks = (doc: string, query: string): string => {
  const paragraphs = doc.split('\n').filter(p => p.trim().length > 30);

  const queryTerms = query.toLowerCase().split(/\s+/);

  const scored = paragraphs.map(p => {
    const lower = p.toLowerCase();

    let score = 0;

    queryTerms.forEach(term => {
      if (lower.includes(term)) score += 2;
    });

    // bonus si coincide frase completa
    if (lower.includes(query.toLowerCase())) score += 5;

    return { text: p, score };
  });

  const topChunks = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(s => s.text)
    .join('\n');

  // fallback — si nada coincide, usar inicio del documento
  if (!topChunks.trim()) {
    return doc.slice(0, 4000);
  }

  return topChunks;
};
