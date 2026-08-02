import React, { useEffect, useState } from 'react';

const codeSnippets = [
  "const graph = new CodeGraph();",
  "import { useAppStore } from './store';",
  "function traverseAST(node: ASTNode) {",
  "interface CodeMetrics { complexity: number; }",
  "if (node.type === 'ClassDeclaration')",
  "yield put(fetchGraphSuccess(data));",
  "await parseRepository(repoUrl);",
  "export default function App() {",
  "// Analyzing dependencies...",
  "Object.keys(nodes).forEach(id => {",
  "let edges = computeEdges();",
  "return { type: 'EntityNode', data };",
  "import React, { useState } from 'react';",
  "def analyze_dependencies():",
  "class DependencyGraph:",
  "while queue:",
  "node = queue.pop(0)",
  "dependencies.add(node)",
  "SELECT * FROM architecture_metrics",
  "await ai_architect.generate_docs()",
  "metrics = compute_cyclomatic_complexity(ast)",
  "graph.add_edge(source, target)",
  "<AnimatedTechBackground />"
];

export const AnimatedTechBackground: React.FC = () => {
  const [elements, setElements] = useState<{ id: number; snippet: string; left: number; duration: number; delay: number; opacity: number }[]>([]);

  useEffect(() => {
    // Generate random floating code snippets
    const newElements = [];
    for (let i = 0; i < 30; i++) {
      newElements.push({
        id: i,
        snippet: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        left: Math.random() * 100, // 0 to 100% across the screen
        duration: 25 + Math.random() * 45, // 25s to 70s float duration
        delay: Math.random() * -70, // Start anywhere in the animation cycle (negative delay)
        opacity: 0.03 + Math.random() * 0.12 // 3% to 15% opacity for depth
      });
    }
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#030305]">
      {/* 1. Animated Tech Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 50s linear infinite',
          WebkitMaskImage: 'radial-gradient(circle at 50% 20%, black, transparent 70%)',
          maskImage: 'radial-gradient(circle at 50% 20%, black, transparent 70%)'
        }}
      />
      
      {/* 2. Floating Code Snippets */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{ 
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black, transparent 90%)', 
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 90%)' 
        }}
      >
        {elements.map((el) => (
          <div
            key={el.id}
            className="absolute whitespace-nowrap font-mono text-xs text-zinc-400"
            style={{
              left: `${el.left}%`,
              top: '110%',
              '--target-opacity': el.opacity,
              animation: `floatUp ${el.duration}s linear infinite`,
              animationDelay: `${el.delay}s`,
            } as React.CSSProperties}
          >
            {el.snippet}
          </div>
        ))}
      </div>

      {/* Embedded Styles for Animations */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.95);
            opacity: 0;
          }
          10% {
            opacity: var(--target-opacity);
            transform: translateY(-15vh) scale(1);
          }
          90% {
            opacity: var(--target-opacity);
            transform: translateY(-105vh) scale(1);
          }
          100% {
            transform: translateY(-120vh) scale(1.05);
            opacity: 0;
          }
        }
        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(500px); /* Multiple of 50px cell size */
          }
        }
      `}</style>
    </div>
  );
};
