import { Layers, Search, Code2, FileText, Terminal, ChevronDown, Check, ArrowRight, Network } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LandingPage: React.FC = () => {
  const { setShowAuthScreen } = useAppStore();

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans selection:bg-white/20 overflow-x-hidden relative">
      <div className="absolute inset-0 bg-noise z-0 pointer-events-none"></div>
      
      {/* 1. Navbar */}
      <nav className="sticky top-0 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800 z-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-black">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              CodeAtlas
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAuthScreen(true)}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <button 
              onClick={() => setShowAuthScreen(true)}
              className="bg-white hover:bg-zinc-200 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-24 pb-20 relative z-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
            Understand any codebase without reading every file.
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-3xl leading-relaxed">
            CodeAtlas transforms repositories into an interactive map of architecture, dependencies and relationships — helping developers explore unfamiliar systems, understand execution flow and generate useful documentation from real source code.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setShowAuthScreen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 px-8 py-3.5 rounded-lg text-base font-semibold transition-all duration-200 shadow-md"
            >
              Analyze Repository
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 border border-zinc-800 hover:bg-white/10 text-white relative px-8 py-3.5 rounded-lg text-base font-medium transition-all duration-200 shadow-sm backdrop-blur-sm"
            >
              Explore How It Works
            </button>
          </div>
          <p className="mt-6 text-sm text-zinc-500 font-medium">From repository to architecture map in minutes.</p>
        </div>

        {/* 3. Product Preview Mockup */}
        <div className="mt-20 relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-black mx-auto max-w-5xl">
          <div className="h-12 bg-zinc-950 border-b border-zinc-800 flex items-center px-4 justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
            </div>
            <div className="flex items-center gap-2 bg-black px-32 py-1.5 rounded-md border border-zinc-800 text-xs text-zinc-500 font-mono shadow-sm">
              <Search className="w-3.5 h-3.5" />
              github.com/company/core-api
            </div>
            <div className="w-12" /> {/* Spacer */}
          </div>
          
          <div className="aspect-[16/9] w-full relative flex">
            {/* Mock Sidebar */}
            <div className="w-64 border-r border-zinc-800 bg-zinc-950 p-4 hidden md:flex flex-col gap-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">Navigation</div>
                <div className="flex items-center gap-2 px-2 py-1.5 bg-white/10 text-white rounded-md text-sm font-medium border border-white/5"><Network className="w-4 h-4"/> Architecture Graph</div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400 hover:bg-white/5 rounded-md text-sm font-medium"><Code2 className="w-4 h-4"/> Source Explorer</div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400 hover:bg-white/5 rounded-md text-sm font-medium"><FileText className="w-4 h-4"/> Documentation</div>
              </div>
            </div>
            
            {/* Mock Graph Area */}
            <div className="flex-1 relative overflow-hidden bg-black p-8">
              {/* Nodes visualization mockup */}
              <div className="absolute top-1/4 left-1/4 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center text-sm font-mono text-zinc-300 shadow-lg">auth_service.py</div>
              <div className="absolute top-1/2 left-[45%] px-4 py-2 bg-zinc-950 border border-white rounded-lg flex items-center justify-center text-sm font-mono text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]">user_controller.ts</div>
              <div className="absolute bottom-1/4 right-1/4 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center text-sm font-mono text-zinc-300 shadow-lg">database.go</div>
              
              {/* Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <path d="M 350 200 Q 450 250, 520 350" fill="none" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 520 400 Q 650 500, 750 550" fill="none" stroke="#ffffff" strokeWidth="2.5" />
              </svg>
            </div>
            
            {/* Mock Context Panel */}
            <div className="w-80 border-l border-zinc-800 bg-zinc-950 p-6 hidden lg:flex flex-col">
              <h3 className="font-semibold text-white text-lg mb-1">user_controller.ts</h3>
              <p className="text-xs text-zinc-500 font-mono mb-6">src/api/controllers/user_controller.ts</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Dependencies (3)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded border border-zinc-800 bg-black text-xs font-mono text-zinc-300"><ArrowRight className="w-3 h-3 text-zinc-500"/> auth_service.py</div>
                    <div className="flex items-center gap-2 p-2 rounded border border-zinc-800 bg-black text-xs font-mono text-zinc-300"><ArrowRight className="w-3 h-3 text-zinc-500"/> logger.ts</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">AI Summary</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed bg-black p-3 rounded-lg border border-zinc-800">
                    Handles incoming HTTP requests for user profiles and delegates authentication checks to the auth_service before returning serialized user data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Problem Section */}
      <section className="py-24 bg-zinc-950 border-y border-zinc-900 relative">
        <div className="absolute inset-0 bg-noise z-0 pointer-events-none opacity-50"></div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                Large codebases are difficult to understand.
              </h3>
              <div className="space-y-6 text-lg text-zinc-400">
                <p>
                  Modern software grows exponentially. As a project matures, the mental model required to safely make changes becomes impossible for any single developer to hold in their head.
                </p>
                <ul className="space-y-4 mt-6 text-zinc-300 text-base">
                  <li className="flex gap-3 items-start">
                    <div className="mt-1 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span><strong>Unclear dependencies</strong> making refactors dangerous.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span><strong>Undocumented architecture</strong> slowing down new hires.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span><strong>Tracing execution flow</strong> manually across dozens of files.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-black p-8 rounded-2xl border border-zinc-800 shadow-2xl font-mono text-sm overflow-hidden text-zinc-400">
              <div className="text-zinc-200 font-semibold mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> grep -r "UserController" src/
              </div>
              <div className="space-y-2 opacity-70">
                <div>src/routes.ts: import {'{'} UserController {'}'} from './controllers'</div>
                <div>src/app.ts: app.use('/users', UserController)</div>
                <div>src/tests/user.test.ts: describe('UserController', () =&gt; ...</div>
                <div>src/services/auth.ts: <span className="text-zinc-500">// Called by UserController</span></div>
                <div>src/models/user.ts: <span className="text-zinc-500">// Returned by UserController</span></div>
                <div>... 47 more matches across 12 directories.</div>
              </div>
              <div className="mt-6 text-white font-bold opacity-80">// Manual exploration doesn't scale.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How CodeAtlas Works */}
      <section id="how-it-works" className="py-24 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <h3 className="text-3xl font-bold mb-16 text-white">How CodeAtlas Works</h3>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-0 relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-zinc-800 z-0" />
            
            <WorkflowStep num="1" title="Connect Repository" desc="Provide local access or connect Git." />
            <WorkflowDivider />
            <WorkflowStep num="2" title="Analyze Structure" desc="AST-based parsing extracts logic." />
            <WorkflowDivider />
            <WorkflowStep num="3" title="Map Dependencies" desc="Relationships are drawn automatically." />
            <WorkflowDivider />
            <WorkflowStep num="4" title="Explore Visually" desc="Navigate the codebase map." />
            <WorkflowDivider />
            <WorkflowStep num="5" title="Generate Docs" desc="Export AI architectural summaries." />
          </div>
        </div>
      </section>

      {/* 6. Code Graph Section */}
      <section className="py-24 bg-zinc-950 text-white border-y border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise z-0 pointer-events-none opacity-50"></div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">See how your codebase connects.</h3>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-16">
            Stop guessing how components relate. CodeAtlas renders an interactive dependency graph of your functions, classes, and files so you can visually trace execution flows and spot architectural bottlenecks.
          </p>
          
          <div className="bg-black rounded-2xl border border-zinc-800 p-2 shadow-2xl overflow-hidden aspect-video relative max-w-5xl mx-auto">
             <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="flex items-center gap-16 relative">
                 <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-700 font-mono text-sm z-10 shadow-lg text-zinc-300">HTTP Router</div>
                 <div className="h-px w-16 bg-zinc-700 absolute left-[100px]" />
                 <div className="p-4 bg-zinc-950 rounded-lg border border-white font-mono text-sm z-10 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-white">PaymentService</div>
                 <div className="h-px w-16 bg-zinc-700 absolute left-[295px] top-[15px] transform rotate-45" />
                 <div className="h-px w-16 bg-zinc-700 absolute left-[295px] top-[35px] transform -rotate-45" />
                 
                 <div className="flex flex-col gap-8 ml-8">
                   <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-700 font-mono text-sm z-10 text-zinc-300">StripeAdapter</div>
                   <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-700 font-mono text-sm z-10 text-zinc-300">ReceiptMailer</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 7. Feature Deep Dives */}
      <section id="features" className="py-24 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-32">
          
          {/* Deep Dive 1 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 text-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Repository Intelligence</h3>
              <p className="text-lg text-zinc-400 mb-6">
                CodeAtlas parses your actual source files using Tree-sitter, accurately mapping semantic tokens without executing the code.
              </p>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-white" /> Extracts functions, classes, and imports</li>
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-white" /> Language agnostic (Python, TS, JS, Go, etc.)</li>
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-white" /> Analyzes purely locally or on your self-hosted instance</li>
              </ul>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                <div className="font-semibold text-zinc-200">Repository Stats</div>
                <div className="text-xs font-mono bg-black border border-zinc-800 text-zinc-300 px-2 py-1 rounded">main</div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-white">247</div>
                  <div className="text-sm text-zinc-500 mt-1">Source Files</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">92</div>
                  <div className="text-sm text-zinc-500 mt-1">External Dependencies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">38</div>
                  <div className="text-sm text-zinc-500 mt-1">Core Modules</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">1,204</div>
                  <div className="text-sm text-zinc-500 mt-1">Functions / Methods</div>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Dive 2 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-sm font-mono text-sm">
               <div className="flex border-b border-zinc-800 pb-4 mb-4 gap-4">
                 <div className="font-bold text-zinc-200">Architecture Overview.md</div>
               </div>
               <div className="space-y-4 text-zinc-400">
                 <p className="font-bold text-white text-lg"># Authentication Flow</p>
                 <p>The system utilizes a JWT-based authentication flow managed by <span className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded border border-zinc-700">auth_service.py</span>.</p>
                 <p className="font-bold text-white mt-4">## Dependencies</p>
                 <ul className="list-disc pl-5 space-y-2">
                   <li><span className="text-zinc-200">user_model</span> - Defines database schema</li>
                   <li><span className="text-zinc-200">redis_cache</span> - Session invalidation</li>
                   <li><span className="text-zinc-200">smtp_client</span> - Magic link delivery</li>
                 </ul>
               </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 text-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Automatic Documentation</h3>
              <p className="text-lg text-zinc-400 mb-6">
                Stop writing docs that go out of date the next day. CodeAtlas can automatically generate structural documentation and architectural summaries based on the real state of your code.
              </p>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-white" /> Exportable to Markdown</li>
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-white" /> Guaranteed accurate to the current commit</li>
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-white" /> Instantly summarizes complex logic blocks</li>
              </ul>
            </div>
          </div>
          
        </div>
      </section>

      {/* 8. Workflow & Use Cases */}
      <section id="use-cases" className="py-24 bg-zinc-950 border-t border-zinc-900 relative">
        <div className="absolute inset-0 bg-noise z-0 pointer-events-none opacity-50"></div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-16 text-center">
            <h3 className="text-3xl font-bold mb-4 text-white">Built for Engineering Workflows</h3>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">CodeAtlas adapts to how your team actually works, providing intelligence at every stage of the development lifecycle.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UseCaseCard 
              title="New Developer Onboarding"
              desc="Help new team members understand an unfamiliar repository before making their first change."
            />
            <UseCaseCard 
              title="Legacy Code Exploration"
              desc="Identify architecture and dependencies in poorly documented projects safely."
            />
            <UseCaseCard 
              title="Architecture Reviews"
              desc="Understand relationships between modules before attempting a major refactor."
            />
            <UseCaseCard 
              title="Debugging & Tracing"
              desc="Follow dependencies and execution relationships across dozens of files instantly."
            />
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section id="faq" className="py-24 bg-black border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <FAQItem 
              q="What languages are supported?"
              a="CodeAtlas primarily supports Python, JavaScript, and TypeScript via Tree-sitter parsing. Support for Go, Java, and C++ is continually expanding."
            />
            <FAQItem 
              q="Does CodeAtlas modify my source code?"
              a="No. CodeAtlas is strictly a read-only analysis tool. It builds an AST to understand your code but will never modify or write to your files."
            />
            <FAQItem 
              q="How is the architecture graph generated?"
              a="We extract import statements, class declarations, function calls, and semantic relationships, then render them using a specialized force-directed graph engine optimized for large datasets."
            />
            <FAQItem 
              q="Can CodeAtlas generate documentation?"
              a="Yes, the AI Architect module reads the structure of your repository and generates markdown-based summaries explaining module responsibilities and data flows."
            />
          </div>
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="py-32 bg-black text-center relative border-t border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white">Stop searching through files.<br/>Start seeing the system.</h3>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Understand architecture, dependencies and relationships through CodeAtlas.
          </p>
          <button 
            onClick={() => setShowAuthScreen(true)}
            className="bg-white text-black hover:bg-zinc-200 px-10 py-4 rounded-lg text-lg font-bold transition-all duration-200 shadow-xl"
          >
            Analyze a Repository
          </button>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="bg-zinc-950 py-16 border-t border-zinc-900 text-zinc-500">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-black">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-lg tracking-tight">CodeAtlas</span>
            </div>
            <p className="text-sm mb-6 max-w-sm text-zinc-400">
              Professional architecture intelligence and code visualization for modern engineering teams.
            </p>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} CodeAtlas Inc.
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Use Cases</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
};

// Helper Components

function WorkflowStep({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center flex-1">
      <div className="w-12 h-12 rounded-full bg-black border border-zinc-700 flex items-center justify-center font-bold text-white mb-4 shadow-sm">
        {num}
      </div>
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-zinc-400 px-4">{desc}</p>
    </div>
  );
}

function WorkflowDivider() {
  return (
    <div className="hidden md:block w-8 shrink-0 relative z-10">
      <ChevronDown className="w-6 h-6 text-zinc-700 mx-auto -rotate-90" />
    </div>
  );
}

function UseCaseCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-black p-6 rounded-xl border border-zinc-800 shadow-sm transition-colors hover:border-zinc-700">
      <h4 className="font-bold text-white mb-3">{title}</h4>
      <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-950/50 backdrop-blur-sm transition-colors hover:bg-zinc-900/50">
      <h4 className="font-bold text-white mb-2">{q}</h4>
      <p className="text-zinc-400 text-sm leading-relaxed">{a}</p>
    </div>
  );
}
