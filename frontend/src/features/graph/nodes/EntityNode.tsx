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
    scale?: number;
  };
}

export const EntityNode = ({ data }: EntityNodeProps) => {
  const getStyleConfig = () => {
    switch (data.type) {
      case 'file': return { icon: <FileCode2 className="w-4 h-4 text-emerald-400" />, border: 'border-emerald-500/30 hover:border-emerald-500/60', bg: 'bg-emerald-500/10', text: 'text-emerald-300' };
      case 'class': return { icon: <Box className="w-4 h-4 text-amber-400" />, border: 'border-amber-500/30 hover:border-amber-500/60', bg: 'bg-amber-500/10', text: 'text-amber-300' };
      case 'function': return { icon: <FunctionSquare className="w-4 h-4 text-violet-400" />, border: 'border-violet-500/30 hover:border-violet-500/60', bg: 'bg-violet-500/10', text: 'text-violet-300' };
      case 'module': return { icon: <PackageOpen className="w-4 h-4 text-sky-400" />, border: 'border-sky-500/30 hover:border-sky-500/60', bg: 'bg-sky-500/10', text: 'text-sky-300' };
      default: return { icon: <Database className="w-4 h-4 text-slate-400" />, border: 'border-white/10 hover:border-white/20', bg: 'bg-white/5', text: 'text-slate-300' };
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
    if (data.isImpactRoot) return 'ring-2 ring-violet-500 shadow-sm border-transparent scale-105';
    if (data.isImpacted) return 'ring-2 ring-rose-500 shadow-sm border-transparent scale-105';
    if (data.isDependency) return 'ring-2 ring-emerald-500 shadow-sm border-transparent scale-105';
    if (data.isSelected) return 'ring-2 ring-indigo-500 shadow-sm border-transparent scale-105';
    return data.isFaded ? 'opacity-20 grayscale-[80%]' : 'hover:-translate-y-0.5 hover:shadow-lg';
  };

  const baseScale = data.scale || 1;

  return (
    <div 
      style={{ transform: `scale(${baseScale})` }} 
      className="origin-center transition-transform duration-500"
    >
      <div className={`
          flex items-center gap-3 px-3.5 py-2.5 rounded-xl border
          min-w-[170px] max-w-[260px]
          bg-[#111115]/80 backdrop-blur-md shadow-xl
          transition-all duration-400 cursor-pointer ${config.border} ${getBlastRadiusStyle()}`}>
      {/* Left Handle */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className={`w-2.5 h-2.5 -ml-1.5 rounded-full border-2 border-[#111115] ${config.bg}`} 
      />
      
      {/* Icon */}
      <div className={`p-2 rounded-lg shrink-0 ${config.bg} shadow-inner`}>
        {config.icon}
      </div>
      
      {/* Name */}
      <span className="font-semibold text-[13px] tracking-tight text-white truncate drop-shadow-sm" title={displayName}>
        {displayName}
      </span>

      {/* Right Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className={`w-2.5 h-2.5 -mr-1.5 rounded-full border-2 border-[#111115] ${config.bg}`} 
      />
      </div>
    </div>
  );
};
