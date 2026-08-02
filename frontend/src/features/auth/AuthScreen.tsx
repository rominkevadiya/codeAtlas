import React, { useState } from 'react';
import { Layers, Loader2, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-[#000000] flex items-center justify-center relative overflow-hidden font-sans selection:bg-zinc-800">
      {/* Background Elements */}
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Back Button */}
      <button 
        onClick={() => setShowAuthScreen(false)}
        className="absolute top-8 left-8 text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium z-50 bg-[#0A0A0A] px-4 py-2 rounded-full border border-white/5 shadow-sm"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        Back to Home
      </button>

      <div className="w-full max-w-md p-6 relative z-10 flex flex-col justify-center h-full max-h-screen">
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4">
            <Layers className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            CodeAtlas <span className="text-zinc-500 font-normal">Pro</span>
          </h1>
          <p className="text-zinc-400 mt-1 text-sm text-center">
            Intelligent architecture exploration
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#000000] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                placeholder="developer"
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#000000] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                  placeholder="dev@company.com"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-zinc-400">Password</label>
                {isLogin && <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Forgot password?</a>}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#000000] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white hover:bg-zinc-200 text-black rounded-lg py-2.5 px-4 text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-white hover:text-zinc-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
