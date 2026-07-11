import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileCode2, Box, FunctionSquare, Database } from 'lucide-react';

interface EntityNodeProps {
  data: {
    id: string;
    name: string;
    type: string;
  };
}

export const EntityNode = ({ data }: EntityNodeProps) => {
  const getIcon = () => {
    switch (data.type) {
      case 'file': return <FileCode2 className="w-3.5 h-3.5 text-blue-500" />;
      case 'class': return <Box className="w-3.5 h-3.5 text-orange-500" />;
      case 'function': return <FunctionSquare className="w-3.5 h-3.5 text-purple-500" />;
      default: return <Database className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getBorderColor = () => {
    switch (data.type) {
      case 'file': return 'border-blue-200/60 dark:border-blue-800/40';
      case 'class': return 'border-orange-200/60 dark:border-orange-800/40';
      case 'function': return 'border-purple-200/60 dark:border-purple-800/40';
      default: return 'border-slate-200 dark:border-slate-700/50';
    }
  };

  const getBgColor = () => {
    switch (data.type) {
      case 'file': return 'bg-blue-50/50 dark:bg-blue-950/20';
      case 'class': return 'bg-orange-50/50 dark:bg-orange-950/20';
      case 'function': return 'bg-purple-50/50 dark:bg-purple-950/20';
      default: return 'bg-slate-50/50 dark:bg-slate-900/30';
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
    // For class/function, id is typically "path/to/file.py:functionName"
    const pathPart = data.id?.split(':')[0];
    return pathPart || '';
  };

  const displayName = getDisplayName();
  const displayPath = getDisplayPath();

  // Node is horizontal now, so handles should be on left and right
  return (
    <div className={`px-3 py-2 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-lg border bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col min-w-[180px] max-w-[280px] transition-all hover:shadow-md ${getBorderColor()}`}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 -ml-1 border-2 border-white dark:border-slate-800" />
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-md ${getBgColor()}`}>
          {getIcon()}
        </div>
        <div className="flex flex-col overflow-hidden w-full">
          <span className="font-semibold text-[13px] text-slate-800 dark:text-slate-200 truncate" title={displayName}>
            {displayName}
          </span>
          <span className="text-[10px] text-slate-400 font-medium truncate" title={displayPath}>
            {displayPath}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 -mr-1 border-2 border-white dark:border-slate-800" />
    </div>
  );
};
