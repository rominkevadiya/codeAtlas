import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Code } from 'lucide-react';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>CodeAtlas</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-500">
        <p>CodeAtlas &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};
