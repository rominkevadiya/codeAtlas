import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Eye, EyeOff, Network, Sparkles, ScanSearch, Check, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { api } from '../../services/api';
import { AnimatedTechBackground } from '../../components/AnimatedTechBackground';

const passwordRules = [
  { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { label: 'One uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'One lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { label: 'One number', test: (value: string) => /\d/.test(value) },
  { label: 'One special character', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const;

export const AuthScreen = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth, setShowAuthScreen } = useAppStore();
  const passwordRuleStates = passwordRules.map((rule) => ({ ...rule, passed: rule.test(password) }));
  const isPasswordValid = passwordRuleStates.every((rule) => rule.passed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && !isPasswordValid) {
      setError('Use a stronger password before creating your account.');
      return;
    }

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex h-screen w-full overflow-hidden text-zinc-200"
    >
      <AnimatedTechBackground />
      <button
        onClick={() => setShowAuthScreen(false)}
        className="absolute left-6 top-6 z-50 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-400 shadow-sm transition hover:border-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="relative z-10 flex w-full items-center justify-center bg-transparent p-6 sm:p-10 lg:w-[64%]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="w-full max-w-2xl rounded-[28px] border border-zinc-800 bg-black/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="CodeAtlas Logo" className="h-11 w-11 object-contain drop-shadow-sm" />
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

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div aria-hidden="true" className="sr-only">
              <input type="text" name="username" autoComplete="username" tabIndex={-1} value="" readOnly />
              <input type="password" name="password" autoComplete="current-password" tabIndex={-1} value="" readOnly />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                name="account-identifier"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-zinc-400"
                placeholder="developer"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  name="account-email"
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-zinc-400"
                  placeholder="dev@company.com"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Password</label>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    required
                    autoComplete={isLogin ? 'off' : 'new-password'}
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    name="account-secret"
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 pr-12 text-sm text-zinc-200 outline-none transition focus:border-zinc-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500 transition hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {!isLogin && passwordFocused && !isPasswordValid && (
                  <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-xs text-zinc-400">
                    <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-zinc-500">Checklist</p>
                    <div className="space-y-2">
                      {passwordRuleStates.map((rule) => (
                        <div
                          key={rule.label}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2 leading-tight ${rule.passed ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-zinc-800 bg-black/20 text-zinc-500'}`}
                        >
                          {rule.passed ? <Check className="h-3 w-3 flex-none" /> : <X className="h-3 w-3 flex-none" />}
                          <span>{rule.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || (!isLogin && !isPasswordValid)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-semibold text-zinc-200 transition hover:text-zinc-200"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 hidden items-center justify-center overflow-hidden border-l border-zinc-800 bg-black/40 backdrop-blur-sm lg:flex lg:w-[48%]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="relative w-full max-w-xl rounded-[32px] border border-zinc-800 bg-black/60 p-8 shadow-sm backdrop-blur-xl"
        >
          <div className="absolute inset-0 pointer-events-none bg-noise opacity-30" />
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
