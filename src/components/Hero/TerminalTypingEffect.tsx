import { useState, useEffect } from "react";
import { FaCode } from 'react-icons/fa';

type Token = { text: string; className: string };

const CODE_LINES: Token[][] = [
  [
    { text: "import", className: "text-[#c678dd]" },
    { text: " { ", className: "text-[#abb2bf]" },
    { text: "SoftwareEngineer", className: "text-[#e5c07b]" },
    { text: " } ", className: "text-[#abb2bf]" },
    { text: "from", className: "text-[#c678dd]" },
    { text: " ", className: "text-[#abb2bf]" },
    { text: "'abhishek.dev'", className: "text-[#98c379]" },
    { text: ";", className: "text-[#abb2bf]" }
  ],
  [],
  [
    { text: "const", className: "text-[#c678dd]" },
    { text: " ", className: "text-[#abb2bf]" },
    { text: "engineer", className: "text-[#61afef]" },
    { text: " = ", className: "text-[#abb2bf]" },
    { text: "new", className: "text-[#c678dd]" },
    { text: " ", className: "text-[#abb2bf]" },
    { text: "SoftwareEngineer", className: "text-[#e5c07b]" },
    { text: "({", className: "text-[#abb2bf]" }
  ],
  [
    { text: "  name:", className: "text-[#d19a66]" },
    { text: " ", className: "text-[#abb2bf]" },
    { text: "'Abhishek Sharma'", className: "text-[#98c379]" },
    { text: ",", className: "text-[#abb2bf]" }
  ],
  [
    { text: "  stack:", className: "text-[#d19a66]" },
    { text: " [", className: "text-[#abb2bf]" },
    { text: "'C++'", className: "text-[#56b6c2]" },
    { text: ", ", className: "text-[#abb2bf]" },
    { text: "'Python'", className: "text-[#56b6c2]" },
    { text: ", ", className: "text-[#abb2bf]" },
    { text: "'Distributed Systems'", className: "text-[#56b6c2]" },
    { text: ", ", className: "text-[#abb2bf]" },
    { text: "'Algorithms'", className: "text-[#56b6c2]" },
    { text: "],", className: "text-[#abb2bf]" }
  ],
  [
    { text: "  focus:", className: "text-[#d19a66]" },
    { text: " ", className: "text-[#abb2bf]" },
    { text: "'High-Performance Systems & Scalable Backends'", className: "text-[#98c379]" }
  ],
  [
    { text: "});", className: "text-[#abb2bf]" }
  ],
  [],
  [
    { text: "await", className: "text-[#c678dd]" },
    { text: " ", className: "text-[#abb2bf]" },
    { text: "engineer", className: "text-[#e5c07b]" },
    { text: ".", className: "text-[#abb2bf]" },
    { text: "build", className: "text-[#61afef]" },
    { text: "();", className: "text-[#abb2bf]" }
  ],
  [
    { text: "  // Featured: Systems Design, Competitive Programming", className: "text-[#5c6370] italic" }
  ],
  [],
  [
    { text: "engineer", className: "text-[#e5c07b]" },
    { text: ".", className: "text-[#abb2bf]" },
    { text: "connect", className: "text-[#61afef]" },
    { text: "();", className: "text-[#abb2bf]" }
  ],
  [
    { text: "console", className: "text-[#e5c07b]" },
    { text: ".", className: "text-[#abb2bf]" },
    { text: "log", className: "text-[#61afef]" },
    { text: "(", className: "text-[#abb2bf]" },
    { text: "'🚀 Let\\'s build something exceptional together!'", className: "text-[#e5c07b]" },
    { text: ");", className: "text-[#abb2bf]" }
  ]
];

// Calculate total characters
const getTotalChars = () => {
  let count = 0;
  CODE_LINES.forEach(line => {
    line.forEach(token => {
      count += token.text.length;
    });
    count += 1; // for newline
  });
  return count;
};

const TOTAL_CHARS = getTotalChars();

const TerminalTypingEffect = () => {
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (charIndex < TOTAL_CHARS) {
      // Medium pace typing (faster for spaces, slightly random)
      const delay = Math.random() * 30 + 10; 
      timeout = setTimeout(() => {
        setCharIndex(prev => prev + 1);
      }, delay);
    } else {
      // Pause at the end, then restart
      timeout = setTimeout(() => {
        setCharIndex(0);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [charIndex]);

  const renderLines = () => {
    let renderedLines = [];
    let charsRemaining = charIndex;

    for (let i = 0; i < CODE_LINES.length; i++) {
      if (charsRemaining <= 0) break;

      const line = CODE_LINES[i];
      let lineTokens = [];

      for (let j = 0; j < line.length; j++) {
        if (charsRemaining <= 0) break;
        
        const token = line[j];
        if (token.text.length <= charsRemaining) {
          lineTokens.push(<span key={j} className={token.className}>{token.text}</span>);
          charsRemaining -= token.text.length;
        } else {
          lineTokens.push(<span key={j} className={token.className}>{token.text.substring(0, charsRemaining)}</span>);
          charsRemaining = 0;
        }
      }

      renderedLines.push(
        <div key={i} className="min-h-[1.5rem]">
          {lineTokens}
        </div>
      );
      charsRemaining -= 1; // account for newline
    }

    return renderedLines;
  };

  return (
    <div className="relative w-full max-w-2xl transform perspective-1000">
      {/* Glow behind terminal */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#c678dd] via-[#61afef] to-[#98c379] rounded-2xl blur-xl opacity-20"></div>
      
      {/* Terminal Window */}
      <div className="relative rounded-xl bg-[#1e1e1e] border border-[#3e3e42] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-mono text-[10px] sm:text-[12px] md:text-[14px] leading-relaxed">
        
        {/* Terminal Header */}
        <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-[#252526] border-b border-[#3e3e42]">
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="mx-auto text-[#858585] text-[10px] sm:text-xs font-semibold tracking-wider">portfolio.ts</div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-6 text-left whitespace-pre relative h-[380px] overflow-x-auto overflow-y-hidden custom-scrollbar">
          {renderLines()}
          <span className="inline-block w-2 h-4 sm:h-5 bg-[#61afef] animate-pulse ml-1 align-middle opacity-80"></span>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-gradient-to-br from-[#c678dd] to-[#61afef] rounded-2xl flex items-center justify-center shadow-lg animate-float z-20">
        <FaCode className="text-white text-2xl" />
      </div>
    </div>
  );
};

export default TerminalTypingEffect;
