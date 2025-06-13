import { useState, useEffect, type ReactNode } from "react";

interface TerminalProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass";
}

const Terminal = ({
  title = "Terminal",
  children,
  className = "",
  variant = "default",
}: TerminalProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const baseClasses =
    variant === "glass"
      ? "bg-black/20 backdrop-blur-xl border border-white/10"
      : "bg-gray-900/95 border border-gray-700/50";

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-2xl ${baseClasses} ${className}`}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-white/60 text-sm font-mono ml-2">{title}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white/80 transition-colors"
            aria-label="Minimize"
          >
            <Minimize2 size={14} />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white/80 transition-colors"
            aria-label="Maximize"
          >
            <Maximize2 size={14} />
          </button>
          <button
            className="p-1 rounded hover:bg-red-500/20 text-red-400/60 hover:text-red-400 transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        className={`transition-all duration-300 ${
          isMinimized ? "h-0 overflow-hidden" : "h-auto"
        }`}
      >
        <div className="p-4 font-mono text-sm">{children}</div>
      </div>
    </div>
  );
};

export default Terminal;
