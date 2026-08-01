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
    isImpactRoot?: boolean;
  };
}

export const EntityNode = ({ data }: EntityNodeProps) => {
  const getStyleConfig = () => {
    switch (data.type) {
      case 'file': return { icon: <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />, border: 'border-emerald-500/30', bg: 'bg-emerald-500/10 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300' };
      case 'class': return { icon: <Box className="w-3.5 h-3.5 text-amber-400" />, border: 'border-amber-500/30', bg: 'bg-amber-500/10 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300' };
      case 'function': return { icon: <FunctionSquare className="w-3.5 h-3.5 text-violet-400" />, border: 'border-violet-500/30', bg: 'bg-violet-500/10 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-300' };
      case 'module': return { icon: <PackageOpen className="w-3.5 h-3.5 text-sky-400" />, border: 'border-sky-500/30', bg: 'bg-sky-500/10 dark:bg-sky-950/30', text: 'text-sky-700 dark:text-sky-300' };
      default: return { icon: <Database className="w-3.5 h-3.5 text-slate-400" />, border: 'border-slate-500/30', bg: 'bg-slate-500/10 dark:bg-slate-900/30', text: 'text-slate-700 dark:text-slate-300' };
    }
  };

  const getDisplayName = () => {
    const rawName = data.name || data.id || 'Unknown';
    if (data.type === 'file') return rawName.split('/').pop() || rawName;
    return rawName;
  };

  const config = getStyleConfig();
  const displayName = getDisplayName();

  const getBlastRadiusStyle = () => {
    if (data.isImpactRoot) return 'ring-2 ring-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-[1.05]';
    if (data.isImpacted) return 'ring-2 ring-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)] scale-[1.02]';
    if (data.isDependency) return 'ring-2 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-[1.02]';
    if (data.isSelected) return 'ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-[1.05]';
    return data.isFaded ? 'opacity-30 grayscale-[50%] scale-95' : 'hover:-translate-y-0.5 hover:shadow-lg';
  };

  return (
    <div className={`
        flex items-center gap-3 px-3 py-2 border rounded-xl 
        min-w-[160px] max-w-[240px]
        ${config.border} bg-white dark:bg-slate-900 shadow-sm
        transition-all duration-300 cursor-pointer ${config.border} ${getBlastRadiusStyle()}`}>
      {/* Left Handle */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className={`w-2 h-2 -ml-1 rounded-full border-2 border-white dark:border-slate-900 ${config.bg}`} 
      />
      
      {/* Icon */}
      <div className={`p-1.5 rounded-lg shrink-0 ${config.bg}`}>
        {config.icon}
      </div>
      
      {/* Name */}
      <span className="font-medium text-[13px] tracking-tight text-slate-900 dark:text-slate-200 truncate" title={displayName}>
        {displayName}
      </span>

      {/* Right Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className={`w-2 h-2 -mr-1 rounded-full border-2 border-white dark:border-slate-900 ${config.bg}`} 
      />
    </div>
  );
};
