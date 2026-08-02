import { Outlet, Link } from 'react-router-dom';
import { Code } from 'lucide-react';

export const MainLayout = () => {
 return (
  <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 ">
   <header className="border-b border-zinc-200 bg-zinc-950 sticky top-0 z-50">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
     <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
      <Code className="h-6 w-6 text-zinc-200 " />
      <span>CodeAtlas</span>
     </Link>
     <nav className="flex items-center gap-6">
      <Link to="/" className="text-sm font-medium hover:text-zinc-200 :text-blue-400 transition-colors">
       Dashboard
      </Link>
     </nav>
    </div>
   </header>
   
   <main className="flex-1 container mx-auto px-4 py-8">
    <Outlet />
   </main>
   
   <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500">
    <p>CodeAtlas &copy; {new Date().getFullYear()}</p>
   </footer>
  </div>
 );
};
