import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Loader2, ArrowLeft, Network, Sparkles, ScanSearch } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { api } from '../../services/api';
import { AnimatedTechBackground } from '../../components/AnimatedTechBackground';

export const AuthScreen = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth, setShowAuthScreen } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/auth/token/', { username, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setAuth(true);
      } else {
        await api.post('/auth/register/', { username, email, password });
        const loginResponse = await api.post('/auth/token/', { username, password });
        localStorage.setItem('access_token', loginResponse.data.access);
        localStorage.setItem('refresh_token', loginResponse.data.refresh);
        setAuth(true);
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      setError(err.response?.data?.detail || err.response?.data?.username?.[0] || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      ref={ref}
      {...props}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="relative flex h-screen w-full overflow-hidden text-zinc-200"
    >
      <AnimatedTechBackground />
      <button onClick={() => setShowAuthScreen(false)} className="absolute left-6 top-6 z-50 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-400 shadow-sm transition hover:border-zinc-400 hover:text-zinc-200">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="relative z-10 flex w-full items-center justify-center bg-transparent p-6 sm:p-10 lg:w-[52%]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="w-full max-w-md rounded-[28px] border border-zinc-800 bg-black/80 backdrop-blur-xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300 border border-zinc-700">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">CodeAtlas</p>
              <p className="text-sm text-zinc-500">Architecture workspace</p>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-zinc-200">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
            <p className="mt-2 text-sm leading-7 text-zinc-400">{isLogin ? 'Sign in to continue exploring your repository architecture.' : 'Create an account to start mapping repositories visually.'}</p>
          </div>

          {error && <div className="mb-5 rounded-2xl border border-rose-900/50 bg-rose-950/30 px-4 py-3 text-sm text-rose-300">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-zinc-400" placeholder="developer" />
            </div>

            {!isLogin && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-zinc-400" placeholder="dev@company.com" />
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-zinc-400" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-70">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-semibold text-zinc-200 transition hover:text-zinc-200">{isLogin ? 'Create one' : 'Sign in'}</button>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 hidden lg:flex lg:w-[48%] items-center justify-center overflow-hidden border-l border-zinc-800 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="relative w-full max-w-xl rounded-[32px] border border-zinc-800 bg-black/60 backdrop-blur-xl p-8 shadow-sm"
        >
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-zinc-200">
              <Sparkles className="h-4 w-4" />
              Live workspace
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-zinc-200">Map software structure in context.</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">Explore architecture graphs, inspect source context, and understand impact before making changes.</p>
            <div className="mt-8 rounded-[24px] border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-200">
                <ScanSearch className="h-4 w-4 text-zinc-200" />
                Repository-aware search
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-zinc-800 bg-black p-3">auth_service.py</div>
                <div className="rounded-2xl border border-zinc-800 bg-black p-3">user_controller.ts</div>
                <div className="rounded-2xl border border-zinc-800 bg-black p-3">database.py</div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-full border border-zinc-800 bg-black px-4 py-2 text-sm text-zinc-400">
              <Network className="h-4 w-4 text-zinc-200" />
              Architecture mapping complete
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});
