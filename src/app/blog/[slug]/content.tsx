function InlineFormat({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("_") && part.endsWith("_")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return <a key={i} href={linkMatch[2]} className="text-violet-600 underline hover:text-violet-700" target="_blank" rel="noopener noreferrer">{linkMatch[1]}</a>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function BlogContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={`q${i}`} className="border-l-4 border-violet-300 pl-4 my-6 text-slate-500 italic leading-relaxed">
          {quoteLines.join("\n")}
        </blockquote>
      );
      continue;
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul${i}`} className="list-disc pl-6 my-4 space-y-2 text-slate-600">
          {items.map((item, j) => <li key={j} className="leading-relaxed"><InlineFormat text={item} /></li>)}
        </ul>
      );
      continue;
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol${i}`} className="list-decimal pl-6 my-4 space-y-2 text-slate-600">
          {items.map((item, j) => <li key={j} className="leading-relaxed"><InlineFormat text={item} /></li>)}
        </ol>
      );
      continue;
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      elements.push(<p key={i} className="text-slate-600 leading-relaxed mb-4"><InlineFormat text={line} /></p>);
    }
    i++;
  }

  return <div className="max-w-none">{elements}</div>;
}
