import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <SyntaxHighlighter language={language} style={vscDarkPlus}>
      {code.trim()}
    </SyntaxHighlighter>
  );
}