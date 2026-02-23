export const findRelevantChunks = (doc: string, query: string): string => {
  const paragraphs = doc.split('\n');

  const scored = paragraphs.map(p => {
    const score = query
      .toLowerCase()
      .split(' ')
      .reduce((acc, word) => acc + (p.toLowerCase().includes(word) ? 1 : 0), 0);

    return { text: p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.text)
    .join('\n');
};
