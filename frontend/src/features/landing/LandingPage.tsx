import React from 'react';
import { Layers, ArrowRight, GitMerge, Shield, Zap, Search, Box, Network, Cpu, Code2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LandingPage: React.FC = () => {
  const { setShowAuthScreen } = useAppStore();

  return (
    <div className="min-h-screen w-full bg-[#050505] text-slate-200 overflow-y-auto overflow-x-hidden font-sans selection:bg-indigo-500/30 relative">
      {/* Background Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Navigation */}
      <nav className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            CodeAtlas <span className="text-indigo-400 font-normal">Pro</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowAuthScreen(true)}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => setShowAuthScreen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-sm"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 relative z-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium mb-8">
            <SparklesIcon className="w-4 h-4" />
            <span>Introducing AI-Powered Code Context</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            Navigate your codebase with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">intelligent precision.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
            CodeAtlas transforms monolithic, opaque codebases into interactive architecture graphs. Instantly understand dependencies, assess blast radiuses, and auto-document legacy code.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setShowAuthScreen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black hover:bg-slate-200 px-8 py-4 rounded-full text-base font-bold transition-all duration-300 group"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#111115] border border-white/10 hover:bg-white/5 text-white px-8 py-4 rounded-full text-base font-medium transition-all duration-300"
            >
              View Features
            </button>
          </div>
        </div>

        {/* Product Preview Mockup */}
        <div className="mt-24 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0c]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          <div className="h-12 bg-[#111] border-b border-white/5 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="mx-auto flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md border border-white/5 text-xs text-slate-500 font-mono">
              <Search className="w-3 h-3" />
              codeatlas-pro-workspace
            </div>
          </div>
          
          <div className="aspect-video w-full relative flex">
            {/* Mock Sidebar */}
            <div className="w-16 border-r border-white/5 flex flex-col items-center py-4 gap-4">
               <Box className="w-5 h-5 text-indigo-400" />
               <Search className="w-5 h-5 text-slate-600" />
               <GitMerge className="w-5 h-5 text-slate-600" />
            </div>
            {/* Mock Graph Area */}
            <div className="flex-1 relative overflow-hidden bg-[#030712] p-8">
              {/* Nodes visualization mockup */}
              <div className="absolute top-1/4 left-1/4 w-32 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-sm font-mono text-indigo-300 shadow-sm">Authentication</div>
              <div className="absolute top-1/2 left-1/2 w-32 h-12 bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-sm font-mono text-purple-300 shadow-sm">UserRepository</div>
              <div className="absolute bottom-1/4 right-1/4 w-32 h-12 bg-white/5 border border-emerald-500/30 rounded-lg flex items-center justify-center text-sm font-mono text-emerald-300">DatabaseConn</div>
              
              {/* Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <path d="M 300 200 Q 400 200, 500 350" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 500 400 Q 600 500, 700 550" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="2" />
              </svg>
            </div>
            
            {/* Mock Right Panel */}
            <div className="w-80 border-l border-white/5 bg-[#0a0a0c] p-6 hidden md:block">
              <div className="h-4 w-24 bg-white/10 rounded mb-6" />
              <div className="space-y-3">
                <div className="h-3 w-full bg-white/5 rounded" />
                <div className="h-3 w-5/6 bg-white/5 rounded" />
                <div className="h-3 w-4/6 bg-white/5 rounded" />
              </div>
              <div className="mt-8 h-32 bg-indigo-500/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <SparklesIcon className="w-4 h-4 text-indigo-400" />
                  <div className="h-3 w-20 bg-indigo-400/20 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/10 rounded" />
                  <div className="h-2 w-3/4 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-white/5 bg-[#030712] relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Powerful Architecture Intelligence</h3>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to untangle legacy spaghetti code and confidently make sweeping architectural changes.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Network className="w-6 h-6 text-indigo-400" />}
              title="Interactive Graphs"
              description="Visualize code complexity. View function calls, class hierarchies, and file dependencies on an interactive canvas."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-rose-400" />}
              title="Blast Radius Analysis"
              description="Before you refactor, instantly know which files and functions will be impacted by your changes."
            />
            <FeatureCard 
              icon={<Cpu className="w-6 h-6 text-purple-400" />}
              title="AI Context & Explanations"
              description="Gemini-powered AI reads the code snippet and its surrounding context to explain complex legacy functions in plain English."
            />
            <FeatureCard 
              icon={<Code2 className="w-6 h-6 text-emerald-400" />}
              title="Code-Level Inspection"
              description="Click any node to instantly view the actual source code behind it without leaving the architectural view."
            />
            <FeatureCard 
              icon={<Box className="w-6 h-6 text-amber-400" />}
              title="Structural Auto-Doc"
              description="Automatically generate beautiful, Markdown-based architectural overviews for your entire repository."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-cyan-400" />}
              title="Language Agnostic"
              description="Powered by Tree-Sitter parsing. CodeAtlas understands Python, JavaScript, TypeScript, and more."
            />
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">Who is CodeAtlas for?</h3>
              <div className="space-y-8">
                <AudienceRow 
                  title="Senior Engineers & Architects"
                  description="Quickly audit entire codebases, verify clean architecture boundaries, and spot tight coupling before it becomes technical debt."
                />
                <AudienceRow 
                  title="New Hires & Onboarding"
                  description="Drastically reduce time-to-first-commit. Let visual graphs and AI explanations teach new developers how the system fits together."
                />
                <AudienceRow 
                  title="Security Researchers"
                  description="Trace data flow through complex applications. Use dependency graphing to find hidden attack vectors in deeply nested call chains."
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-zinc-800/50 rounded-3xl blur-2xl" />
              <div className="bg-[#111115] border border-white/10 rounded-3xl p-8 relative">
                <blockquote className="text-xl text-slate-300 italic mb-6 leading-relaxed">
                  "CodeAtlas fundamentally changed how we handle legacy migrations. We used to spend days grepping through spaghetti code; now we just look at the blast radius graph."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-400 border border-white/10">JD</div>
                  <div>
                    <div className="font-semibold text-white">Jane Doe</div>
                    <div className="text-sm text-slate-500">Staff Software Engineer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-white/5 bg-[#030712] py-20 text-center relative z-20">
        <h4 className="text-3xl font-bold text-white mb-6">Ready to see your code differently?</h4>
        <button 
          onClick={() => setShowAuthScreen(true)}
          className="bg-white hover:bg-slate-200 text-black px-8 py-4 rounded-full text-base font-bold transition-all duration-300 shadow-xl"
        >
          Create your free account
        </button>
        <div className="mt-16 text-slate-600 text-sm">
          &copy; {new Date().getFullYear()} CodeAtlas Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// Helper Components

function SparklesIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all duration-300 group">
      <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-semibold text-white mb-3">{title}</h4>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function AudienceRow({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 mt-1">
        <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-white/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-indigo-400" />
        </div>
      </div>
      <div>
        <h5 className="text-lg font-semibold text-white mb-2">{title}</h5>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
