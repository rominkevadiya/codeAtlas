import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Search, ArrowRight, ChevronDown, Network, FileCode2, Sparkles, FileText, Check, Bot, ScanSearch, Cpu, Filter } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AnimatedTechBackground } from '../../components/AnimatedTechBackground';

export const LandingPage = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const { setShowAuthScreen } = useAppStore();

  return (
    <motion.div
      ref={ref}
      {...props}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-full text-zinc-200 font-sans selection:bg-zinc-200/20 overflow-x-hidden relative"
    >
      <AnimatedTechBackground />
      <div className="absolute inset-0 bg-noise z-0 pointer-events-none mix-blend-overlay opacity-50" />

      <nav className="sticky top-0 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700 shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-zinc-400 uppercase">CodeAtlas</p>
              <p className="text-xs text-zinc-500">Architecture intelligence</p>
            </div>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-zinc-200">How It Works</a>
            <a href="#features" className="transition-colors hover:text-zinc-200">Features</a>
            <a href="#use-cases" className="transition-colors hover:text-zinc-200">Use Cases</a>
            <a href="#faq" className="transition-colors hover:text-zinc-200">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAuthScreen(true)} className="hidden rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-400 transition hover:bg-black hover:text-zinc-200 sm:block">
              Sign In
            </button>
            <button onClick={() => setShowAuthScreen(true)} className="flex items-center gap-2 rounded-full bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-200">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 pb-24 pt-16 md:px-10 md:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.06fr_0.94fr]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm font-medium text-zinc-400 shadow-sm">
              <ScanSearch className="h-4 w-4 text-zinc-200" />
              Repository-aware architecture exploration
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-zinc-200 sm:text-5xl lg:text-6xl">
              Understand a codebase before changing it.
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              CodeAtlas turns repositories into an interactive architecture map so teams can inspect dependencies, follow source context, assess impact, and ask questions with repository-aware AI.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setShowAuthScreen(true)} className="flex items-center justify-center gap-2 rounded-full bg-zinc-800 border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-200">
                Analyze a Repository
                <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-black hover:text-zinc-200">
                See how it works
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-400">
              <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5">ZIP upload</span>
              <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5">GitHub / GitLab import</span>
              <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5">Live analysis progress</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="soft-card overflow-hidden rounded-[28px] border-zinc-800 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)] bg-black"
          >
            <div className="rounded-[22px] border border-zinc-800 bg-[#09090b] p-3">
              <div className="flex items-center justify-between rounded-[16px] border border-zinc-800 bg-zinc-950 px-4 py-3 text-xs text-zinc-400">
                <div className="flex items-center gap-2 text-zinc-200">
                  <Search className="h-4 w-4" />
                  Repository workspace preview
                </div>
                <div className="rounded-full border border-zinc-800 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                  live analysis
                </div>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-[0.88fr_1.12fr]">
                <div className="rounded-[18px] border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                    <Network className="h-4 w-4 text-zinc-200" />
                    Architecture graph
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm font-medium text-zinc-200">auth_service.py</div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm font-medium text-zinc-200">user_controller.ts</div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm font-medium text-zinc-200">database.py</div>
                  </div>
                </div>
                <div className="rounded-[18px] border border-zinc-800 bg-zinc-950 p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-200">
                    <FileCode2 className="h-4 w-4 text-[var(--accent)]" />
                    Inspector panel
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-black p-4 text-sm text-zinc-400">
                    <p className="font-semibold text-zinc-200">authenticateUser()</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Source context</p>
                    <p className="mt-3 leading-6">The selected node exposes source snippets and dependency relationships while the AI assistant explains the surrounding architecture.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <section id="how-it-works" className="border-y border-zinc-800 bg-transparent backdrop-blur-[2px] px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-200">The problem</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-zinc-200 sm:text-4xl">
              Codebases do not come with a map.
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              A new developer opens an unfamiliar repository and must reconstruct the system from scattered files, incomplete docs, and implicit conventions. One change can ripple across modules in ways that are easy to miss.
            </p>
            <div className="mt-8 space-y-4 text-zinc-200">
              <div className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-black px-4 py-4 shadow-sm">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200/10 text-zinc-200">
                  <Check className="h-4 w-4" />
                </div>
                <p>Dependencies are spread across modules, making safe refactors harder.</p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-black px-4 py-4 shadow-sm">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200/10 text-zinc-200">
                  <Check className="h-4 w-4" />
                </div>
                <p>Important entry points and flows are hard to locate quickly.</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-[28px] border border-zinc-800 bg-black p-6 shadow-sm"
          >
            <div className="rounded-[20px] border border-zinc-800 bg-zinc-950 p-5 font-mono text-sm text-zinc-400">
              <div className="mb-4 flex items-center gap-2 text-zinc-500">
                <Cpu className="h-4 w-4" />
                repository scan
              </div>
              <div className="space-y-2">
                <p>src/routes.ts → auth middleware</p>
                <p>src/controllers/user.ts → profile service</p>
                <p>src/services/auth.ts → token validator</p>
                <p>src/models/user.ts → persistence layer</p>
              </div>
              <p className="mt-6 text-zinc-500">CodeAtlas turns that search path into a navigable architecture view.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="bg-transparent backdrop-blur-[2px] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mb-16 max-w-2xl text-center mx-auto"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold text-zinc-200 sm:text-4xl">From repository imports to architectural understanding.</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-400">The workflow is intentionally straightforward: import, parse, map, inspect, and explain.</p>
          </motion.div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div 
                key={step.title} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-[24px] border border-zinc-800 bg-zinc-950 p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200/10 text-sm font-semibold text-zinc-200">
                  0{index + 1}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-200">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-zinc-800 bg-transparent backdrop-blur-[2px] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mb-16 max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">Core Features</p>
            <h2 className="mt-4 text-3xl font-semibold text-zinc-200 sm:text-4xl">Everything you need to navigate complexity.</h2>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Network,
                title: 'Architecture Visualization',
                description: 'See the big picture. View your codebase as a force-directed graph to understand dependencies instantly.',
              },
              {
                icon: Sparkles,
                title: 'AI Explanation',
                description: 'Select any node to generate a context-aware explanation of its purpose and its role within the larger system.',
              },
              {
                icon: FileText,
                title: 'Auto-Documentation',
                description: 'Automatically generate comprehensive documentation for the entire repository, structured by component and flow.',
              },
              {
                icon: ScanSearch,
                title: 'Impact Analysis',
                description: 'Select a component to instantly see its "blast radius" — what relies on it and what might break if changed.',
              },
              {
                icon: Bot,
                title: 'Repository-Aware Chat',
                description: 'Ask questions about the architecture and get answers grounded in the actual codebase structure.',
              },
              {
                icon: Filter,
                title: 'Intelligent Filtering',
                description: 'Filter out the noise. Search and filter by file types, node patterns, and specific architecture domains.',
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-2xl border border-zinc-800 bg-black p-6 shadow-sm transition hover:border-zinc-700 hover:bg-zinc-950/50"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-200">{feature.title}</h3>
                <p className="text-sm leading-6 text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="border-t border-zinc-800 bg-transparent backdrop-blur-[2px] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">Use cases</p>
            <h2 className="mt-4 text-3xl font-semibold text-zinc-200 sm:text-4xl">A calmer way to work through unfamiliar systems.</h2>
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {useCases.map((useCase, idx) => (
              <motion.div 
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-[24px] border border-zinc-800 bg-zinc-950 p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-zinc-200">{useCase.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-10 bg-transparent backdrop-blur-[2px]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-7xl rounded-[32px] border border-zinc-800 bg-zinc-950 p-8 shadow-sm lg:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">Supported tech</p>
              <h2 className="mt-4 text-3xl font-semibold text-zinc-200 sm:text-4xl">Current deep parsing covers the Python and JavaScript/TypeScript ecosystem.</h2>
              <p className="mt-5 text-lg leading-8 text-zinc-400">The workspace currently parses Python, JavaScript, JSX, TypeScript, TSX, and JSON files to create a structural graph for your repository.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['Python', 'JavaScript', 'TypeScript', 'JSX', 'TSX', 'JSON'].map((label) => (
                <span key={label} className="rounded-full border border-zinc-800 bg-black px-4 py-2 text-sm font-medium text-zinc-200 shadow-sm">{label}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="faq" className="px-6 pb-24 md:px-10 bg-transparent backdrop-blur-[2px]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl"
        >
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">FAQ</p>
            <h2 className="mt-4 text-3xl font-semibold text-zinc-200 sm:text-4xl">A few practical answers.</h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </motion.div>
      </section>

      <section className="border-t border-zinc-800 bg-transparent backdrop-blur-[2px] px-6 py-24 md:px-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto flex max-w-7xl flex-col items-center text-center"
        >
          <h2 className="text-3xl font-semibold text-zinc-200 sm:text-4xl">Your codebase already has an architecture. CodeAtlas helps you see it.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">Import a repository, inspect its structure, and start asking questions with the context of the real codebase.</p>
          <button onClick={() => setShowAuthScreen(true)} className="mt-8 flex items-center gap-2 rounded-full bg-zinc-800 border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-200">
            Analyze a Repository
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </section>

      <footer className="border-t border-zinc-800 bg-transparent backdrop-blur-[2px] px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">CodeAtlas</p>
                <p className="text-sm text-zinc-400">Architecture intelligence for software teams</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">A developer-focused workspace for understanding code structure, dependencies, source context, impact, and repository-aware AI conversations.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-400">
              <li><a href="#features" className="transition hover:text-zinc-200">Features</a></li>
              <li><a href="#how-it-works" className="transition hover:text-zinc-200">How It Works</a></li>
              <li><a href="#use-cases" className="transition hover:text-zinc-200">Use Cases</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Account</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-400">
              <li><button onClick={() => setShowAuthScreen(true)} className="transition hover:text-zinc-200">Sign In</button></li>
              <li><button onClick={() => setShowAuthScreen(true)} className="transition hover:text-zinc-200">Create Account</button></li>
            </ul>
          </div>
        </div>
      </footer>
    </motion.div>
  );
});

const steps = [
  { title: 'Import repository', desc: 'Upload a ZIP archive or point CodeAtlas to a public GitHub or GitLab repository.' },
  { title: 'Parse structure', desc: 'Tree-sitter reads the codebase and builds a structured understanding of files, classes, and functions.' },
  { title: 'Map relationships', desc: 'CodeAtlas builds a graph of dependencies and architectural links that can be explored directly.' },
  { title: 'Inspect and document', desc: 'View source snippets, understand blast radius, and generate documentation from the parsed structure.' },
];

const useCases = [
  { title: 'Onboarding', desc: 'Help new developers get oriented in an unfamiliar codebase quickly.' },
  { title: 'Refactoring', desc: 'Assess dependency scope before making changes to core modules.' },
  { title: 'Legacy systems', desc: 'Create a navigable mental model for older or poorly documented projects.' },
  { title: 'Architecture reviews', desc: 'Understand where coupling and structural hotspots are concentrated.' },
];

const faqs = [
  { q: 'What does CodeAtlas actually do?', a: 'CodeAtlas imports a repository, parses supported source files, builds an architecture graph, and helps you inspect that structure through a workspace UI and AI assistant.' },
  { q: 'Which languages are supported?', a: 'The current parser deeply supports Python and the JavaScript/TypeScript ecosystem, including JSON files.' },
  { q: 'Can I upload a ZIP archive?', a: 'Yes. The workspace supports ZIP uploads and public GitHub or GitLab repository imports.' },
  { q: 'Does it modify my source files?', a: 'No. CodeAtlas is a read-only analysis workflow that inspects repository structure without changing your code.' },
];

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[20px] border border-zinc-800 bg-zinc-950 px-5 py-4 shadow-sm">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 text-left">
        <span className="text-base font-semibold text-zinc-200">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="mt-4 text-sm leading-7 text-zinc-400">{a}</p>}
    </div>
  );
};
