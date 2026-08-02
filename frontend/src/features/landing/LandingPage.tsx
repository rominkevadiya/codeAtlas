import { Layers, Search, Code2, FileText, Terminal, ChevronDown, Check, ArrowRight, Network } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LandingPage: React.FC = () => {
  const { setShowAuthScreen } = useAppStore();

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      
      {/* 1. Navbar */}
      <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              CodeAtlas
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#use-cases" className="hover:text-blue-600 transition-colors">Use Cases</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAuthScreen(true)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <button 
              onClick={() => setShowAuthScreen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-24 pb-20 relative z-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-slate-900 leading-tight">
            Understand any codebase without reading every file.
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl leading-relaxed">
            CodeAtlas transforms repositories into an interactive map of architecture, dependencies and relationships — helping developers explore unfamiliar systems, understand execution flow and generate useful documentation from real source code.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setShowAuthScreen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-8 py-3.5 rounded-lg text-base font-semibold transition-all duration-200 shadow-md"
            >
              Analyze Repository
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-8 py-3.5 rounded-lg text-base font-medium transition-all duration-200 shadow-sm"
            >
              Explore How It Works
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-500 font-medium">From repository to architecture map in minutes.</p>
        </div>

        {/* 3. Product Preview Mockup */}
        <div className="mt-20 relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white mx-auto max-w-5xl">
          <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <div className="w-3 h-3 rounded-full bg-slate-300" />
            </div>
            <div className="flex items-center gap-2 bg-white px-32 py-1.5 rounded-md border border-slate-200 text-xs text-slate-500 font-mono shadow-sm">
              <Search className="w-3.5 h-3.5" />
              github.com/company/core-api
            </div>
            <div className="w-12" /> {/* Spacer */}
          </div>
          
          <div className="aspect-[16/9] w-full relative flex">
            {/* Mock Sidebar */}
            <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 hidden md:flex flex-col gap-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Navigation</div>
                <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium"><Network className="w-4 h-4"/> Architecture Graph</div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md text-sm font-medium"><Code2 className="w-4 h-4"/> Source Explorer</div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md text-sm font-medium"><FileText className="w-4 h-4"/> Documentation</div>
              </div>
            </div>
            
            {/* Mock Graph Area */}
            <div className="flex-1 relative overflow-hidden bg-slate-900 p-8">
              {/* Nodes visualization mockup */}
              <div className="absolute top-1/4 left-1/4 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-sm font-mono text-white shadow-lg">auth_service.py</div>
              <div className="absolute top-1/2 left-[45%] px-4 py-2 bg-blue-600 border border-blue-500 rounded-lg flex items-center justify-center text-sm font-mono text-white shadow-lg shadow-blue-900/50 ring-2 ring-blue-400">user_controller.ts</div>
              <div className="absolute bottom-1/4 right-1/4 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-sm font-mono text-slate-300 shadow-lg">database.go</div>
              
              {/* Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <path d="M 350 200 Q 450 250, 520 350" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 520 400 Q 650 500, 750 550" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
              </svg>
            </div>
            
            {/* Mock Context Panel */}
            <div className="w-80 border-l border-slate-200 bg-white p-6 hidden lg:flex flex-col">
              <h3 className="font-semibold text-slate-900 text-lg mb-1">user_controller.ts</h3>
              <p className="text-xs text-slate-500 font-mono mb-6">src/api/controllers/user_controller.ts</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Dependencies (3)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50 text-xs font-mono text-slate-700"><ArrowRight className="w-3 h-3 text-slate-400"/> auth_service.py</div>
                    <div className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50 text-xs font-mono text-slate-700"><ArrowRight className="w-3 h-3 text-slate-400"/> logger.ts</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">AI Summary</h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
                    Handles incoming HTTP requests for user profiles and delegates authentication checks to the auth_service before returning serialized user data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Problem Section */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 leading-tight">
                Large codebases are difficult to understand.
              </h3>
              <div className="space-y-6 text-lg text-slate-600">
                <p>
                  Modern software grows exponentially. As a project matures, the mental model required to safely make changes becomes impossible for any single developer to hold in their head.
                </p>
                <ul className="space-y-4 mt-6">
                  <li className="flex gap-3 items-start">
                    <div className="mt-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                    </div>
                    <span><strong>Unclear dependencies</strong> making refactors dangerous.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-amber-600" />
                    </div>
                    <span><strong>Undocumented architecture</strong> slowing down new hires.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                    </div>
                    <span><strong>Tracing execution flow</strong> manually across dozens of files.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner font-mono text-sm overflow-hidden text-slate-400">
              <div className="text-slate-800 font-semibold mb-4 border-b border-slate-200 pb-2">grep -r "UserController" src/</div>
              <div className="space-y-2 opacity-50">
                <div>src/routes.ts: import {'{'} UserController {'}'} from './controllers'</div>
                <div>src/app.ts: app.use('/users', UserController)</div>
                <div>src/tests/user.test.ts: describe('UserController', () =&gt; ...</div>
                <div>src/services/auth.ts: // Called by UserController</div>
                <div>src/models/user.ts: // Returned by UserController</div>
                <div>... 47 more matches across 12 directories.</div>
              </div>
              <div className="mt-6 text-red-600 font-bold opacity-80">// Manual exploration doesn't scale.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How CodeAtlas Works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <h3 className="text-3xl font-bold mb-16 text-slate-900">How CodeAtlas Works</h3>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-0 relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-slate-200 z-0" />
            
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
      <section className="py-24 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">See how your codebase connects.</h3>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-16">
            Stop guessing how components relate. CodeAtlas renders an interactive dependency graph of your functions, classes, and files so you can visually trace execution flows and spot architectural bottlenecks.
          </p>
          
          <div className="bg-slate-950 rounded-2xl border border-slate-700 p-2 shadow-2xl overflow-hidden aspect-video relative max-w-5xl mx-auto">
             <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%239C92AC\\' fill-opacity=\\'0.4\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="flex items-center gap-16 relative">
                 <div className="p-4 bg-slate-800 rounded-lg border border-slate-600 font-mono text-sm z-10 shadow-lg">HTTP Router</div>
                 <div className="h-0.5 w-16 bg-blue-500 absolute left-[100px]" />
                 <div className="p-4 bg-blue-600 rounded-lg border border-blue-500 font-mono text-sm z-10 shadow-lg ring-4 ring-blue-500/20">PaymentService</div>
                 <div className="h-0.5 w-16 bg-slate-600 absolute left-[295px] top-[15px] transform rotate-45" />
                 <div className="h-0.5 w-16 bg-slate-600 absolute left-[295px] top-[35px] transform -rotate-45" />
                 
                 <div className="flex flex-col gap-8 ml-8">
                   <div className="p-4 bg-slate-800 rounded-lg border border-slate-600 font-mono text-sm z-10">StripeAdapter</div>
                   <div className="p-4 bg-slate-800 rounded-lg border border-slate-600 font-mono text-sm z-10">ReceiptMailer</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 7. Feature Deep Dives */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-32">
          
          {/* Deep Dive 1 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Repository Intelligence</h3>
              <p className="text-lg text-slate-600 mb-6">
                CodeAtlas parses your actual source files using Tree-sitter, accurately mapping semantic tokens without executing the code.
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-blue-600" /> Extracts functions, classes, and imports</li>
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-blue-600" /> Language agnostic (Python, TS, JS, Go, etc.)</li>
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-blue-600" /> Analyzes purely locally or on your self-hosted instance</li>
              </ul>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                <div className="font-semibold text-slate-800">Repository Stats</div>
                <div className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">main</div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-slate-900">247</div>
                  <div className="text-sm text-slate-500 mt-1">Source Files</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">92</div>
                  <div className="text-sm text-slate-500 mt-1">External Dependencies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">38</div>
                  <div className="text-sm text-slate-500 mt-1">Core Modules</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">1,204</div>
                  <div className="text-sm text-slate-500 mt-1">Functions / Methods</div>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Dive 2 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm font-mono text-sm">
               <div className="flex border-b border-slate-200 pb-4 mb-4 gap-4">
                 <div className="font-bold text-slate-800">Architecture Overview.md</div>
               </div>
               <div className="space-y-4 text-slate-600">
                 <p className="font-bold text-slate-800 text-lg"># Authentication Flow</p>
                 <p>The system utilizes a JWT-based authentication flow managed by <span className="bg-slate-200 px-1 rounded">auth_service.py</span>.</p>
                 <p className="font-bold text-slate-800 mt-4">## Dependencies</p>
                 <ul className="list-disc pl-5 space-y-1">
                   <li><span className="text-blue-600">user_model</span> - Defines database schema</li>
                   <li><span className="text-blue-600">redis_cache</span> - Session invalidation</li>
                   <li><span className="text-blue-600">smtp_client</span> - Magic link delivery</li>
                 </ul>
               </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Automatic Documentation</h3>
              <p className="text-lg text-slate-600 mb-6">
                Stop writing docs that go out of date the next day. CodeAtlas can automatically generate structural documentation and architectural summaries based on the real state of your code.
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-blue-600" /> Exportable to Markdown</li>
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-blue-600" /> Guaranteed accurate to the current commit</li>
                <li className="flex gap-2 items-center"><Check className="w-5 h-5 text-blue-600" /> Instantly summarizes complex logic blocks</li>
              </ul>
            </div>
          </div>
          
        </div>
      </section>

      {/* 8. Workflow & Use Cases */}
      <section id="use-cases" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="mb-16 text-center">
            <h3 className="text-3xl font-bold mb-4 text-slate-900">Built for Engineering Workflows</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">CodeAtlas adapts to how your team actually works, providing intelligence at every stage of the development lifecycle.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section id="faq" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-12 text-center text-slate-900">Frequently Asked Questions</h3>
          <div className="space-y-6">
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
      <section className="py-24 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Stop searching through files.<br/>Start seeing the system.</h3>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Understand architecture, dependencies and relationships through CodeAtlas.
          </p>
          <button 
            onClick={() => setShowAuthScreen(true)}
            className="bg-white text-blue-600 hover:bg-slate-100 px-10 py-4 rounded-lg text-lg font-bold transition-all duration-200 shadow-xl"
          >
            Analyze a Repository
          </button>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="bg-slate-900 py-16 text-slate-400">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 text-white">
              <Layers className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-lg tracking-tight">CodeAtlas</span>
            </div>
            <p className="text-sm mb-6 max-w-sm">
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
      <div className="w-12 h-12 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center font-bold text-blue-600 mb-4 shadow-sm">
        {num}
      </div>
      <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600 px-4">{desc}</p>
    </div>
  );
}

function WorkflowDivider() {
  return (
    <div className="hidden md:block w-8 shrink-0 relative z-10">
      <ChevronDown className="w-6 h-6 text-slate-300 mx-auto -rotate-90" />
    </div>
  );
}

function UseCaseCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h4 className="font-bold text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
      <h4 className="font-bold text-slate-900 mb-2">{q}</h4>
      <p className="text-slate-600">{a}</p>
    </div>
  );
}
