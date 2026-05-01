function InlineFormat({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("_") && part.endsWith("_")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="px-1.5 py-0.5 bg-slate-100 text-violet-700 rounded text-[0.85em] font-mono">{part.slice(1, -1)}</code>;
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const isExternal = linkMatch[2].startsWith("http");
          return (
            <a
              key={i}
              href={linkMatch[2]}
              className="text-violet-600 underline hover:text-violet-700"
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {linkMatch[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function PipeTable({ rows }: { rows: string[][] }) {
  if (rows.length < 2) return null;
  const headers = rows[0];
  const body = rows.slice(1);

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-slate-50">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-2.5 font-semibold text-slate-700 border-b border-slate-200">
                <InlineFormat text={h.trim()} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className="border-b border-slate-100 last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2 text-slate-600">
                  <InlineFormat text={cell.trim()} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function parseTableRow(line: string): string[] {
  return line.replace(/^\|/, "").replace(/\|$/, "").split("|");
}

function isSeparatorRow(line: string): boolean {
  return /^\|?[\s-:|]+\|[\s-:|]+\|?$/.test(line);
}

export default function BlogContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Pipe tables
    if (line.includes("|") && i + 1 < lines.length && isSeparatorRow(lines[i + 1])) {
      const tableRows: string[][] = [];
      tableRows.push(parseTableRow(line));
      i++; // skip header
      i++; // skip separator
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        tableRows.push(parseTableRow(lines[i]));
        i++;
      }
      elements.push(<PipeTable key={`table${i}`} rows={tableRows} />);
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      elements.push(<hr key={i} className="my-8 border-slate-200" />);
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-2"><InlineFormat text={line.slice(4)} /></h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-3"><InlineFormat text={line.slice(3)} /></h2>);
    } else if (line.startsWith("# ")) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-3"><InlineFormat text={line.slice(2)} /></h2>);
    } else if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={`q${i}`} className="border-l-4 border-violet-300 pl-4 my-6 text-slate-500 italic leading-relaxed">
          {quoteLines.map((ql, qi) => (
            <p key={qi} className={qi > 0 ? "mt-2" : ""}>
              <InlineFormat text={ql} />
            </p>
          ))}
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
