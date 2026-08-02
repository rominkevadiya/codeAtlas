import React from 'react';
import { Layers, ArrowRight, GitMerge, Shield, Zap, Search, Box, Network, Cpu, Code2, CheckCircle2, Globe, Mail, MessageCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LandingPage: React.FC = () => {
  const { setShowAuthScreen } = useAppStore();

  return (
    <div className="min-h-screen w-full bg-[#000000] text-zinc-300 overflow-y-auto overflow-x-hidden font-sans selection:bg-zinc-800 relative">
      {/* Subtle Grid Background & Noise */}
      <div className="fixed inset-0 bg-noise pointer-events-none z-[1]" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* Navigation */}
      <nav className="h-20 max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between relative z-20 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
            <Layers className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            CodeAtlas <span className="text-zinc-500 font-normal">Pro</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Enterprise</a>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowAuthScreen(true)}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Sign In
          </button>
          <button 
            onClick={() => setShowAuthScreen(true)}
            className="bg-white hover:bg-zinc-200 text-black text-sm font-semibold px-5 py-2.5 rounded-md transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24 relative z-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium mb-8">
            <SparklesIcon className="w-3 h-3 text-zinc-400" />
            <span>Architecture intelligence for complex codebases</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] text-white">
            Navigate your codebase.<br />
            <span className="text-zinc-500">With absolute precision.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-3xl leading-relaxed">
            Transform opaque repositories into interactive architecture graphs. Instantly understand dependencies, assess blast radiuses, and document legacy systems without the guesswork.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setShowAuthScreen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 px-8 py-3.5 rounded-md text-sm font-bold transition-all duration-200 group"
            >
              Start Exploring
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-white px-8 py-3.5 rounded-md text-sm font-medium transition-all duration-200"
            >
              View Features
            </button>
          </div>
        </div>

        {/* Product Preview Mockup */}
        <div className="mt-32 relative rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#0A0A0A] mx-auto max-w-5xl">
          <div className="h-10 bg-[#111111] border-b border-zinc-800 flex items-center px-4 gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
            </div>
            <div className="flex items-center gap-2 bg-black px-4 py-1.5 rounded-md border border-zinc-800 text-xs text-zinc-500 font-mono mx-auto">
              <Search className="w-3 h-3" />
              codeatlas-workspace
            </div>
          </div>
          
          <div className="aspect-[16/9] w-full relative flex">
            {/* Mock Sidebar */}
            <div className="w-16 border-r border-zinc-800 flex flex-col items-center py-4 gap-6 bg-[#0A0A0A]">
               <Box className="w-5 h-5 text-zinc-300" />
               <Search className="w-5 h-5 text-zinc-600" />
               <GitMerge className="w-5 h-5 text-zinc-600" />
            </div>
            {/* Mock Graph Area */}
            <div className="flex-1 relative overflow-hidden bg-[#000000] p-8">
              {/* Nodes visualization mockup */}
              <div className="absolute top-1/4 left-1/4 px-4 py-2 bg-[#111] border border-zinc-700 rounded flex items-center justify-center text-xs font-mono text-white shadow-sm">Authentication</div>
              <div className="absolute top-1/2 left-[45%] px-4 py-2 bg-[#111] border border-zinc-700 rounded flex items-center justify-center text-xs font-mono text-white shadow-sm">UserRepository</div>
              <div className="absolute bottom-1/4 right-1/4 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-xs font-mono text-zinc-400">DatabaseConn</div>
              
              {/* Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <path d="M 350 200 Q 450 250, 520 350" fill="none" stroke="#333" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 520 400 Q 650 500, 750 550" fill="none" stroke="#555" strokeWidth="1.5" />
              </svg>
            </div>
            
            {/* Mock Right Panel */}
            <div className="w-80 border-l border-zinc-800 bg-[#0A0A0A] p-6 hidden lg:block">
              <div className="h-5 w-24 bg-zinc-800 rounded mb-8" />
              <div className="space-y-4">
                <div className="h-2.5 w-full bg-zinc-800 rounded" />
                <div className="h-2.5 w-5/6 bg-zinc-800 rounded" />
                <div className="h-2.5 w-4/6 bg-zinc-800 rounded" />
              </div>
              <div className="mt-10 bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon className="w-4 h-4 text-zinc-400" />
                  <div className="h-2.5 w-24 bg-zinc-700 rounded" />
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-zinc-800 rounded" />
                  <div className="h-2 w-3/4 bg-zinc-800 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* How it works Section */}
      <section id="how-it-works" className="py-24 border-t border-zinc-900 bg-[#050505] relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="mb-16 md:text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">How CodeAtlas Works</h3>
            <p className="text-zinc-500 max-w-2xl md:mx-auto text-lg">A simple pipeline from your raw code to deep architectural understanding.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-zinc-800 z-0" />
            
            <div className="relative z-10 bg-[#0A0A0A] border border-zinc-800 rounded-xl p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-6 shadow-xl">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Connect Repository</h4>
              <p className="text-zinc-400 leading-relaxed">Upload or link your Git repository. We securely parse your codebase entirely locally or via your self-hosted instance.</p>
            </div>
            
            <div className="relative z-10 bg-[#0A0A0A] border border-zinc-800 rounded-xl p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-6 shadow-xl">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Deep Analysis</h4>
              <p className="text-zinc-400 leading-relaxed">Our Tree-sitter engine builds an AST to extract functions, classes, and complex semantic dependencies.</p>
            </div>
            
            <div className="relative z-10 bg-[#0A0A0A] border border-zinc-800 rounded-xl p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-6 shadow-xl">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Visualize & Refactor</h4>
              <p className="text-zinc-400 leading-relaxed">Interact with your architecture. Identify dead code, high coupling, and execute refactors with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-zinc-900 bg-[#000000] relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Powerful Architecture Intelligence</h3>
            <p className="text-zinc-500 max-w-2xl text-lg">Everything you need to untangle legacy systems and confidently execute sweeping architectural changes.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            <FeatureCard 
              icon={<Network className="w-6 h-6 text-white" />}
              title="Interactive Graphs"
              description="Visualize code complexity. View function calls, class hierarchies, and file dependencies on a clean canvas."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-white" />}
              title="Blast Radius Analysis"
              description="Instantly determine exactly which files and functions will be impacted by your proposed changes."
            />
            <FeatureCard 
              icon={<Cpu className="w-6 h-6 text-white" />}
              title="Contextual Insights"
              description="Advanced analysis parses snippets and surrounding context to explain complex legacy logic directly."
            />
            <FeatureCard 
              icon={<Code2 className="w-6 h-6 text-white" />}
              title="Code-Level Inspection"
              description="Click any node to view the underlying source code without context-switching to an IDE."
            />
            <FeatureCard 
              icon={<Box className="w-6 h-6 text-white" />}
              title="Structural Auto-Doc"
              description="Automatically generate comprehensive, standardized documentation for your entire repository."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-white" />}
              title="Universal Parsing"
              description="Powered by Tree-Sitter. Natively supports Python, JavaScript, TypeScript, Go, and more."
            />
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="testimonials" className="py-24 border-t border-zinc-900 bg-[#050505] relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-10 text-white">Engineered for teams</h3>
              <div className="space-y-12">
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
            <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl p-10 md:p-12 shadow-2xl relative">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/5 rounded-full blur-3xl" />
              <blockquote className="text-xl md:text-2xl text-zinc-200 mb-10 leading-relaxed font-medium">
                "CodeAtlas fundamentally altered our legacy migration strategy. We replaced days of manual grepping with instant blast-radius mapping. It's an indispensable tool for our engineering organization."
              </blockquote>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg">JD</div>
                <div>
                  <div className="font-bold text-white text-base">Jane Doe</div>
                  <div className="text-sm text-zinc-500 font-medium">Staff Software Engineer, Acme Corp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-900 bg-[#000000] py-32 relative z-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#ffffff0a_0%,transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h4 className="text-4xl md:text-5xl font-bold text-white mb-8">Deploy clarity to your codebase.</h4>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Join thousands of engineers who are shipping better code faster with CodeAtlas architecture intelligence.
          </p>
          <button 
            onClick={() => setShowAuthScreen(true)}
            className="bg-white hover:bg-zinc-200 text-black px-10 py-4 rounded-md text-base font-bold transition-all duration-200 shadow-xl shadow-white/10"
          >
            Start Building Today
          </button>
        </div>
      </section>

      {/* Full Footer */}
      <footer className="border-t border-zinc-900 bg-[#050505] py-20 relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                  <Layers className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  CodeAtlas <span className="text-zinc-500 font-normal">Pro</span>
                </h2>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mb-8">
                Enterprise-grade architecture intelligence and code visualization for modern engineering teams.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Features</a></li>
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Integrations</a></li>
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Pricing</a></li>
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Changelog</a></li>
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">About Us</a></li>
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Careers</a></li>
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Blog</a></li>
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Contact</a></li>
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Partners</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Security</a></li>
                <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-zinc-600 text-sm font-medium">
              &copy; {new Date().getFullYear()} CodeAtlas Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-zinc-500">All systems operational</span>
            </div>
          </div>
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
    <div className="group flex flex-col">
      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-white mb-3">{title}</h4>
      <p className="text-zinc-500 leading-relaxed text-base flex-1">{description}</p>
    </div>
  );
}

function AudienceRow({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex gap-6">
      <div className="mt-1 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4 text-white" />
      </div>
      <div>
        <h5 className="text-xl font-bold text-white mb-3">{title}</h5>
        <p className="text-zinc-400 leading-relaxed text-base">{description}</p>
      </div>
    </div>
  );
}
