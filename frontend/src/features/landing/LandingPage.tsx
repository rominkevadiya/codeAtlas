import React from 'react';
import { Layers, ArrowRight, GitMerge, Shield, Zap, Search, Box, Network, Cpu, Code2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LandingPage: React.FC = () => {
  const { setShowAuthScreen } = useAppStore();

  return (
    <div className="min-h-screen w-full bg-[#000000] text-zinc-300 overflow-y-auto overflow-x-hidden font-sans selection:bg-zinc-800 relative">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* Navigation */}
      <nav className="h-16 max-w-6xl mx-auto px-6 flex items-center justify-between relative z-20 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
            <Layers className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            CodeAtlas <span className="text-zinc-500 font-normal">Pro</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowAuthScreen(true)}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => setShowAuthScreen(true)}
            className="bg-white hover:bg-zinc-200 text-black text-sm font-semibold px-4 py-2 rounded-md transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium mb-8">
            <SparklesIcon className="w-3 h-3 text-zinc-400" />
            <span>Architecture intelligence for complex codebases</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-white">
            Navigate your codebase.<br />
            <span className="text-zinc-500">With absolute precision.</span>
          </h2>
          
          <p className="text-lg text-zinc-400 mb-10 max-w-2xl leading-relaxed">
            Transform opaque repositories into interactive architecture graphs. Instantly understand dependencies, assess blast radiuses, and document legacy systems without the guesswork.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setShowAuthScreen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-md text-sm font-semibold transition-all duration-200 group"
            >
              Start Exploring
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-white px-6 py-3 rounded-md text-sm font-medium transition-all duration-200"
            >
              View Features
            </button>
          </div>
        </div>

        {/* Product Preview Mockup */}
        <div className="mt-24 relative rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#0A0A0A]">
          <div className="h-10 bg-[#111111] border-b border-zinc-800 flex items-center px-4 gap-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            </div>
            <div className="flex items-center gap-2 bg-black px-3 py-1 rounded border border-zinc-800 text-xs text-zinc-500 font-mono mx-auto">
              <Search className="w-3 h-3" />
              codeatlas-workspace
            </div>
          </div>
          
          <div className="aspect-video w-full relative flex">
            {/* Mock Sidebar */}
            <div className="w-16 border-r border-zinc-800 flex flex-col items-center py-4 gap-4 bg-[#0A0A0A]">
               <Box className="w-5 h-5 text-zinc-300" />
               <Search className="w-5 h-5 text-zinc-600" />
               <GitMerge className="w-5 h-5 text-zinc-600" />
            </div>
            {/* Mock Graph Area */}
            <div className="flex-1 relative overflow-hidden bg-[#000000] p-8">
              {/* Nodes visualization mockup */}
              <div className="absolute top-1/4 left-1/4 px-4 py-2 bg-[#111] border border-zinc-700 rounded flex items-center justify-center text-xs font-mono text-white shadow-sm">Authentication</div>
              <div className="absolute top-1/2 left-1/2 px-4 py-2 bg-[#111] border border-zinc-700 rounded flex items-center justify-center text-xs font-mono text-white shadow-sm">UserRepository</div>
              <div className="absolute bottom-1/4 right-1/4 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-xs font-mono text-zinc-400">DatabaseConn</div>
              
              {/* Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <path d="M 300 200 Q 400 200, 500 350" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 500 400 Q 600 500, 700 550" fill="none" stroke="#555" strokeWidth="1" />
              </svg>
            </div>
            
            {/* Mock Right Panel */}
            <div className="w-80 border-l border-zinc-800 bg-[#0A0A0A] p-6 hidden md:block">
              <div className="h-4 w-24 bg-zinc-800 rounded mb-6" />
              <div className="space-y-3">
                <div className="h-2 w-full bg-zinc-800 rounded" />
                <div className="h-2 w-5/6 bg-zinc-800 rounded" />
                <div className="h-2 w-4/6 bg-zinc-800 rounded" />
              </div>
              <div className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <SparklesIcon className="w-3 h-3 text-zinc-400" />
                  <div className="h-2 w-20 bg-zinc-700 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-zinc-800 rounded" />
                  <div className="h-2 w-3/4 bg-zinc-800 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-zinc-900 bg-[#000000] relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-4 text-white">Powerful Architecture Intelligence</h3>
            <p className="text-zinc-500 max-w-2xl">Everything you need to untangle legacy systems and confidently execute sweeping architectural changes.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            <FeatureCard 
              icon={<Network className="w-5 h-5 text-white" />}
              title="Interactive Graphs"
              description="Visualize code complexity. View function calls, class hierarchies, and file dependencies on a clean canvas."
            />
            <FeatureCard 
              icon={<Shield className="w-5 h-5 text-white" />}
              title="Blast Radius Analysis"
              description="Instantly determine exactly which files and functions will be impacted by your proposed changes."
            />
            <FeatureCard 
              icon={<Cpu className="w-5 h-5 text-white" />}
              title="Contextual Insights"
              description="Advanced analysis parses snippets and surrounding context to explain complex legacy logic directly."
            />
            <FeatureCard 
              icon={<Code2 className="w-5 h-5 text-white" />}
              title="Code-Level Inspection"
              description="Click any node to view the underlying source code without context-switching to an IDE."
            />
            <FeatureCard 
              icon={<Box className="w-5 h-5 text-white" />}
              title="Structural Auto-Doc"
              description="Automatically generate comprehensive, standardized documentation for your entire repository."
            />
            <FeatureCard 
              icon={<Zap className="w-5 h-5 text-white" />}
              title="Universal Parsing"
              description="Powered by Tree-Sitter. Natively supports Python, JavaScript, TypeScript, Go, and more."
            />
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 border-t border-zinc-900 bg-[#050505] relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h3 className="text-2xl font-bold mb-8 text-white">Engineered for teams</h3>
              <div className="space-y-10">
                <AudienceRow 
                  title="Senior Architects"
                  description="Audit complete codebases, verify architecture boundaries, and detect tight coupling before it becomes technical debt."
                />
                <AudienceRow 
                  title="New Hires"
                  description="Accelerate onboarding. Visual graphs and architectural explanations teach new developers system constraints instantly."
                />
                <AudienceRow 
                  title="Security Engineers"
                  description="Trace data flow through applications. Map dependencies to discover hidden vulnerabilities in deep call chains."
                />
              </div>
            </div>
            <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-8">
              <blockquote className="text-lg text-zinc-300 mb-8 leading-relaxed">
                "CodeAtlas fundamentally altered our legacy migration strategy. We replaced days of manual grepping with instant blast-radius mapping."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">JD</div>
                <div>
                  <div className="font-semibold text-white text-sm">Jane Doe</div>
                  <div className="text-xs text-zinc-500">Staff Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-zinc-900 bg-[#000000] py-24 text-center relative z-20">
        <h4 className="text-2xl font-bold text-white mb-6">Deploy clarity to your codebase.</h4>
        <button 
          onClick={() => setShowAuthScreen(true)}
          className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-md text-sm font-semibold transition-all duration-200"
        >
          Start building today
        </button>
        <div className="mt-20 text-zinc-600 text-xs font-medium">
          &copy; {new Date().getFullYear()} CodeAtlas Pro. Enterprise-grade code intelligence.
        </div>
      </footer>
    </div>
  );
};

// Helper Components

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group">
      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-white mb-2">{title}</h4>
      <p className="text-zinc-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function AudienceRow({ title, description }: { title: string, description: string }) {
  return (
    <div>
      <h5 className="text-sm font-semibold text-white mb-2">{title}</h5>
      <p className="text-zinc-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
