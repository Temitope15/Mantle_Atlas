import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, className = '', position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  return (
    <div 
      className={`relative inline-block group/tooltip ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="cursor-help">{children}</div>
      {isVisible && (
        <div className={`absolute z-[100] w-64 p-3 rounded-xl bg-dark-900 border border-white/10 text-[10px] font-medium text-slate-300 leading-relaxed shadow-2xl animate-in fade-in zoom-in duration-200 ${positionClasses[position]}`}>
          {content}
          {/* Arrow */}
          <div className={`absolute w-2 h-2 bg-dark-900 border-r border-b border-white/10 rotate-45 ${
            position === 'top' ? 'top-full -mt-1 left-1/2 -translate-x-1/2 border-t-0 border-l-0' :
            position === 'bottom' ? 'bottom-full -mb-1 left-1/2 -translate-x-1/2 border-b-0 border-r-0' :
            position === 'left' ? 'left-full -ml-1 top-1/2 -translate-y-1/2 border-l-0 border-b-0' :
            'right-full -mr-1 top-1/2 -translate-y-1/2 border-r-0 border-t-0'
          }`} />
        </div>
      )}
    </div>
  );
}
