interface SimpleMarkdownProps {
  children: React.ReactNode;
}

// Simple Markdown renderer
export const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ children }) => {
  if (!children) return null;

  const text = String(children);
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={index} className="bg-background/50 px-1 rounded">
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </div>
  );
};
