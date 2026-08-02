import React, { useState } from 'react';
import { Layers, Loader2, ArrowLeft, Network } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { api } from '../../services/api';

export const AuthScreen: React.FC = () => {
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
        const response = await api.post('/auth/token/', {
          username,
          password
        });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setAuth(true);
      } else {
        await api.post('/auth/register/', {
          username,
          email,
          password
        });
        
        // Auto-login after registration
        const loginResponse = await api.post('/auth/token/', {
          username,
          password
        });
        localStorage.setItem('access_token', loginResponse.data.access);
        localStorage.setItem('refresh_token', loginResponse.data.refresh);
        setAuth(true);
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      setError(
        err.response?.data?.detail || 
        err.response?.data?.username?.[0] || 
        'Authentication failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-black flex overflow-hidden font-sans text-white relative">
      <div className="absolute inset-0 bg-noise z-0"></div>
      
      <button 
        onClick={() => setShowAuthScreen(false)}
        className="absolute top-6 left-6 text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium z-50 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-md shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10 relative">
        <div className="w-full max-w-sm flex flex-col justify-center h-full gap-4">
          <div className="flex flex-col items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-md mb-6 text-black">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-zinc-400 text-sm">
              {isLogin ? 'Sign in to explore your architectural maps.' : 'Sign up to visualize your codebases.'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/20 transition-all"
                placeholder="developer"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/20 transition-all"
                  placeholder="dev@company.com"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Password</label>
                {isLogin && <a href="#" className="text-[11px] text-zinc-500 hover:text-zinc-300 font-medium transition-colors">Forgot?</a>}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white hover:bg-zinc-200 text-black rounded-lg py-2.5 px-4 text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                <>{isLogin ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-zinc-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-white hover:text-zinc-300 font-semibold transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Abstract Graphic */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 items-center justify-center overflow-hidden border-l border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 pointer-events-none"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.04]"></div>
        
        {/* Abstract blurred graph representation */}
        <div className="relative w-[120%] h-[120%] -right-10 flex items-center justify-center opacity-40 blur-sm pointer-events-none">
          <svg className="w-full h-full text-zinc-700" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 20 20 Q 50 10, 80 30" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <path d="M 80 30 Q 90 60, 50 80" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <path d="M 50 80 Q 20 90, 20 20" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <circle cx="20" cy="20" r="1.5" fill="#fff" />
            <circle cx="80" cy="30" r="1" fill="#fff" />
            <circle cx="50" cy="80" r="2" fill="#fff" />
            
            <path d="M 30 50 Q 50 50, 70 60" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1,1"/>
            <circle cx="30" cy="50" r="1" fill="#fff" />
            <circle cx="70" cy="60" r="1" fill="#fff" />
          </svg>
        </div>
        
        <div className="absolute bottom-12 right-12 flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-md rounded-lg border border-zinc-800 text-xs text-zinc-400 shadow-xl">
           <Network className="w-4 h-4 text-zinc-500" />
           Architecture mapping complete
        </div>
      </div>
    </div>
  );
};
