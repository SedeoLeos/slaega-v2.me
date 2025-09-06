export  function splitMarkdownByParagraphs(md: string, numberOfParagraphs = 2): [string, string] {
    // Découpe sur deux sauts de ligne (fin de paragraphe)
    const parts = md.split(/\n\s*\n/);
  
    const preview = parts.slice(0, numberOfParagraphs).join('\n\n');
    const rest = parts.slice(numberOfParagraphs).join('\n\n');
  
    return [preview, rest];
}