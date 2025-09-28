

import React from 'react';
import { CopyIcon } from './icons/CopyIcon';

// Enhanced formatLine to handle inline code
const formatLine = (line: string): React.ReactNode => {
  const parts = line.split(/(\*\*.*?\*\*|_.*?_|\*.*?\*|`.*?`)/g).filter(Boolean);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    // Handle inline code
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-gray-700/50 text-cyan-300 font-mono rounded px-1.5 py-0.5 text-sm">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

export const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const elements: React.ReactNode[] = [];
  const lines = text.split('\n');
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = '';

  const flushList = () => {
    if (listItems.length > 0) {
      const listKey = `list-${elements.length}`;
      const ListComponent = listType === 'ol' ? 'ol' : 'ul';
      const listClass = listType === 'ol' ? 'list-decimal list-inside space-y-1 my-2' : 'list-disc list-inside space-y-1 my-2';
      elements.push(
        <ListComponent key={listKey} className={listClass}>
          {listItems.map((item, i) => (
            <li key={i}>{formatLine(item)}</li>
          ))}
        </ListComponent>
      );
      listItems = [];
      listType = null;
    }
  };

  const flushCodeBlock = () => {
    if (codeBlockContent.length > 0) {
      const codeKey = `code-${elements.length}`;
      elements.push(
        <div key={codeKey} className="my-3 bg-gray-900/70 rounded-lg overflow-hidden border border-gray-700">
           <div className="flex justify-between items-center px-4 py-1.5 bg-gray-800/80 text-xs text-gray-400 font-mono">
             <span>{codeBlockLang || 'code'}</span>
             <button
                onClick={() => navigator.clipboard.writeText(codeBlockContent.join('\n'))}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Copy code"
            >
                <CopyIcon />
            </button>
           </div>
           <pre className="p-4 text-sm overflow-x-auto font-mono"><code className={`language-${codeBlockLang}`}>{codeBlockContent.join('\n')}</code></pre>
        </div>
      );
      codeBlockContent = [];
      codeBlockLang = '';
    }
  };

  lines.forEach((line, index) => {
    const codeBlockMatch = line.match(/^```(\w*)/);
    
    if (codeBlockMatch) {
        if (inCodeBlock) {
            flushCodeBlock();
            inCodeBlock = false;
        } else {
            flushList();
            inCodeBlock = true;
            codeBlockLang = codeBlockMatch[1];
        }
        return;
    }

    if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
    }

    const ulMatch = line.match(/^\s*[-*]\s+(.*)/);
    const olMatch = line.match(/^\s*\d+\.\s+(.*)/);
    const h3Match = line.match(/^###\s+(.*)/);
    const h2Match = line.match(/^##\s+(.*)/);
    const h1Match = line.match(/^#\s+(.*)/);

    if (ulMatch) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listItems.push(ulMatch[1]);
    } else if (olMatch) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listItems.push(olMatch[1]);
    } else {
      flushList();
      if (h1Match) {
          elements.push(<h1 key={`h1-${elements.length}`} className="text-2xl font-bold my-3">{formatLine(h1Match[1])}</h1>)
      } else if (h2Match) {
          elements.push(<h2 key={`h2-${elements.length}`} className="text-xl font-bold my-2">{formatLine(h2Match[1])}</h2>)
      } else if (h3Match) {
          elements.push(<h3 key={`h3-${elements.length}`} className="text-lg font-semibold my-2">{formatLine(h3Match[1])}</h3>)
      } else if (line.trim()) {
          elements.push(<p key={`p-${elements.length}`} className="my-2">{formatLine(line)}</p>);
      } else if (index > 0 && lines[index - 1].trim()) {
          elements.push(<div key={`br-${elements.length}`} className="h-2" />);
      }
    }
  });

  flushList();
  flushCodeBlock(); // flush any open code block at the end

  return <div className="whitespace-pre-wrap font-sans">{elements}</div>;
};