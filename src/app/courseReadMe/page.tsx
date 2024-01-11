"use client"
import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import demoContent from '!!raw-loader!./FastApi.md';
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}
interface TitleProps {
  title: string;
  selected: boolean;
  onClick: () => void;
  isBold: boolean;
}
const Title: React.FC<TitleProps> = ({ title, selected, onClick, isBold }) => (
  <div
    className={`basis-2/12 mt-5 cursor-pointer ${selected ? 'font-bold' : ''}`}
    onClick={onClick}
  >
    {isBold ? <strong>{title}</strong> : title}
  </div>
);
const isEqual = (array1: any[], array2: any[]): boolean => {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
};
const MarkdownPreviewer: React.FC = () => {
  const [titles, setTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const extractTitles = (source: string) => {
    const regex = /^#{1,3}\s+(.*)/gm;
    const matches = Array.from(source.matchAll(regex), (match) => match[1]);
    return matches;
  };
  useEffect(() => {
    const newTitles = extractTitles(demoContent);
    if (!isEqual(newTitles, titles)) {
      setTitles(newTitles);
    }
    if (!selectedTitle && newTitles.length > 0) {
      handleTitleClick(newTitles[0]);
    }
  }, [demoContent, titles, selectedTitle]);
  const handleTitleClick = (title: string) => {
    setSelectedTitle(title);
    const index = titles.indexOf(title);
    if (index !== -1) {
      const element = document.getElementById(`heading-${index}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  const components: any = {
    code: ({ inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '');
      const customStyle = {
        backgroundColor: '#2d2d2d',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
      };
      const syntaxHighlighterStyle = solarizedlight;

      return !inline && match ? (
        <SyntaxHighlighter
          style={syntaxHighlighterStyle}
          language={match[1]}
          PreTag="div"
          children={String(children).replace(/\n$/, '')}
          {...props}
          customStyle={customStyle}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }: { children: React.ReactNode }) => {
      const headingText = String(children);
      const headingId = headingText.toLowerCase().replace(/\s+/g, '-');
      return (
        <h1 id={`heading-${titles.indexOf(headingText)}`} className={`mt-2 mb-2`}>
          {children}
        </h1>
      );
    },
    h2: ({ children }: { children: React.ReactNode }) => {
      const headingText = String(children);
      const headingId = headingText.toLowerCase().replace(/\s+/g, '-');
      return (
        <h2 id={`heading-${titles.indexOf(headingText)}`} className={`mt-5 `}>
          {children}
        </h2>
      );
    },
    h3: ({ children }: { children: React.ReactNode }) => {
      const headingText = String(children);
      const headingId = headingText.toLowerCase().replace(/\s+/g, '-');
      return (
        <h3 id={`heading-${titles.indexOf(headingText)}`} className={`mt-5`}>
          {children}
        </h3>
      );
    },
    strong: ({ children }: { children: React.ReactNode }) => (
      <div className={`mt-5`}>
        <strong>{children}</strong>
      </div>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <div className={`mt-5`}>
        <p>{children}</p>
      </div>
    ),
  };


  return (
    <div className='ml-10 mr-10 mb-10'>
      <div className='flex flex-row'>
        <div className='basis-10/12' style={{ height: '80vh', overflow: 'scroll' }} ref={contentRef}>
          <div className={`p-10  rounded border-1 border-gray-200`}>
            <ReactMarkdown components={components} children={demoContent} />
          </div>
        </div>
        <div className='basis-2/12 p-10'>
          {titles.map((title, index) => (
            <Title
              key={index}
              title={title}
              selected={selectedTitle === title}
              onClick={() => handleTitleClick(title)}
              isBold={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default MarkdownPreviewer;
