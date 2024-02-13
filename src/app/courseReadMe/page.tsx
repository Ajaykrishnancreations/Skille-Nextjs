//@ts-nocheck
'use client'
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import markdownData from '!!raw-loader!./FastApi.md';
import gfm from 'remark-gfm';
export default function MarkdownPreviewer({
}: {
  }) {
  const components = {
    code: ({
      className,
      children,
      ...props
    }: {
      className: string;
      children: string;
    }) => {
      const match = /language-(\w+)/.exec(className || "");
      const syntaxHighlight = vscDarkPlus;
      const customStyle = {
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
      };
      return match ? (
        <SyntaxHighlighter
          style={syntaxHighlight}
          language={match[1]}
          {...props}
          customStyle={customStyle}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code>{children}</code>
      );
    },
    h1: ({ children }: { children: any }) => {
      return (
        <div className="mb-4"><h1 className="text-5xl font-bold text-violet-300">{children}</h1>
        </div>
      );
    },
    h2: ({ children }: { children: any }) => {
      return (
        <h2 className="text-3xl font-bold" id={children}>
          {children}
        </h2>
      );
    },
    h3: ({ children }: { children: any }) => {
      return <h3 className="text-xl font-semibold">{children}</h3>;
    },
    strong: ({ children }: { children: any }) => (
      <strong className="font-bold">{children}</strong>
    ),
    p: ({ children }: { children: any }) => <p>{children}</p>,
    a: ({ children, href }) =>
      <a style={{ color: "blue", textDecorationLine: "underline", display: "inline-flex" }} href={href}>
        {/* <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
          <path d="M14.851 11.923c-.179-.641-.521-1.246-1.025-1.749-1.562-1.562-4.095-1.563-5.657 0l-4.998 4.998c-1.562 1.563-1.563 4.095 0 5.657 1.562 1.563 4.096 1.561 5.656 0l3.842-3.841.333.009c.404 0 .802-.04 1.189-.117l-4.657 4.656c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-1.952-1.951-1.952-5.12 0-7.071l4.998-4.998c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464.493.493.861 1.063 1.105 1.672l-.787.784zm-5.703.147c.178.643.521 1.25 1.026 1.756 1.562 1.563 4.096 1.561 5.656 0l4.999-4.998c1.563-1.562 1.563-4.095 0-5.657-1.562-1.562-4.095-1.563-5.657 0l-3.841 3.841-.333-.009c-.404 0-.802.04-1.189.117l4.656-4.656c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464 1.951 1.951 1.951 5.119 0 7.071l-4.999 4.998c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-.494-.495-.863-1.067-1.107-1.678l.788-.785z" />
        </svg> */}
        {children}
      </a>,
  };
  return (
    <div className="flex flex-col gap-6 px-4 justify-center w-full">
      {/* <ReactMarkdown remarkPlugins={[gfm]} components={components}>{markdownData}</ReactMarkdown> */}
      <ReactMarkdown components={components}>{markdownData}</ReactMarkdown>
    </div>
  );
}