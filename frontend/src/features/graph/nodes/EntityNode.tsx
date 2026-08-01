import { Handle, Position } from '@xyflow/react';
import { FileCode2, Box, FunctionSquare, Database, PackageOpen } from 'lucide-react';

interface EntityNodeProps {
  data: {
    id: string;
    name: string;
    type: string;
    isImpacted?: boolean;
    isDependency?: boolean;
    isSelected?: boolean;
    isFaded?: boolean;
  };
}

export const EntityNode = ({ data }: EntityNodeProps) => {
  const getStyleConfig = () => {
    switch (data.type) {
      case 'file': 
        return {
          icon: <FileCode2 className="w-4 h-4 text-emerald-400" />,
          border: 'border-emerald-500/30 group-hover:border-emerald-400/60',
          bg: 'bg-emerald-500/10 dark:bg-emerald-950/30',
          glow: 'bg-emerald-500/20',
          text: 'text-emerald-700 dark:text-emerald-300',
          badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        };
      case 'class': 
        return {
          icon: <Box className="w-4 h-4 text-amber-400" />,
          border: 'border-amber-500/30 group-hover:border-amber-400/60',
          bg: 'bg-amber-500/10 dark:bg-amber-950/30',
          glow: 'bg-amber-500/20',
          text: 'text-amber-700 dark:text-amber-300',
          badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        };
      case 'function': 
        return {
          icon: <FunctionSquare className="w-4 h-4 text-violet-400" />,
          border: 'border-violet-500/30 group-hover:border-violet-400/60',
          bg: 'bg-violet-500/10 dark:bg-violet-950/30',
          glow: 'bg-violet-500/20',
          text: 'text-violet-700 dark:text-violet-300',
          badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800',
        };
      case 'module':
        return {
          icon: <PackageOpen className="w-4 h-4 text-sky-400" />,
          border: 'border-sky-500/30 group-hover:border-sky-400/60',
          bg: 'bg-sky-500/10 dark:bg-sky-950/30',
          glow: 'bg-sky-500/20',
          text: 'text-sky-700 dark:text-sky-300',
          badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        };
      default: 
        return {
          icon: <Database className="w-4 h-4 text-slate-400" />,
          border: 'border-slate-500/30 group-hover:border-slate-400/60',
          bg: 'bg-slate-500/10 dark:bg-slate-900/30',
          glow: 'bg-slate-500/20',
          text: 'text-slate-700 dark:text-slate-300',
          badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const getDisplayName = () => {
    if (data.type === 'file') {
      return data.name.split('/').pop() || data.name;
    }
    return data.name;
  };

  const getDisplayPath = () => {
    if (data.type === 'file') {
      const parts = data.name.split('/');
      parts.pop();
      return parts.join('/') || '/';
    }
    const pathPart = data.id?.split(':')[0];
    return pathPart || '';
  };

  const config = getStyleConfig();
  const displayName = getDisplayName();
  const displayPath = getDisplayPath();
  const getBlastRadiusStyle = () => {
    if (data.isImpacted) {
      return {
        wrapper: 'ring-2 ring-rose-500 shadow-rose-500/20 shadow-xl scale-[1.05]',
        glow: 'bg-rose-500/30 opacity-100 blur-xl',
      };
    }
    if (data.isDependency) {
      return {
        wrapper: 'ring-2 ring-emerald-500 shadow-emerald-500/20 shadow-xl scale-[1.02]',
        glow: 'bg-emerald-500/30 opacity-100 blur-xl',
      };
    }
    if (data.isSelected) {
      return {
        wrapper: 'ring-2 ring-blue-500 shadow-blue-500/20 shadow-xl scale-[1.05]',
        glow: 'bg-blue-500/30 opacity-100 blur-xl',
      };
    }
    return {
      wrapper: data.isFaded ? 'opacity-30 grayscale-[50%] scale-95' : 'hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02]',
      glow: `opacity-0 group-hover:opacity-100 blur-xl ${config.glow}`,
    };
  };

  const blastStyle = getBlastRadiusStyle();

  return (
    <div className={`group relative flex flex-col min-w-[220px] max-w-[320px] rounded-2xl border bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-xl shadow-lg transition-all duration-300 ease-out cursor-pointer ${config.border} ${blastStyle.wrapper}`}>
      {/* Background ambient glow on hover or active */}
      <div className={`absolute -inset-0.5 rounded-2xl transition-opacity duration-300 -z-10 ${blastStyle.glow}`} />
      
      {/* Left Handle */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className={`w-3 h-3 -ml-1.5 rounded-full border-2 border-white dark:border-slate-900 transition-colors ${config.bg} ${config.border}`} 
      />
      
      {/* Node Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Header: Icon & Type Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/10 ${config.bg}`}>
            {config.icon}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badge}`}>
            {data.type}
          </span>
        </div>
        
        {/* Body: Name & Path */}
        <div className="flex flex-col gap-1 overflow-hidden">
          <span className="font-semibold text-[15px] tracking-tight text-slate-900 dark:text-white truncate" title={displayName}>
            {displayName}
          </span>
          {displayPath && (
            <span className={`text-xs font-medium truncate ${config.text}`} title={displayPath}>
              {displayPath}
            </span>
          )}
        </div>
      </div>

      {/* Right Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className={`w-3 h-3 -mr-1.5 rounded-full border-2 border-white dark:border-slate-900 transition-colors ${config.bg} ${config.border}`} 
      />
    </div>
  );
};
