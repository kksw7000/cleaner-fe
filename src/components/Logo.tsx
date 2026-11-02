import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = "", iconOnly = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon representing cleanliness and shine */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 shadow-md shadow-cyan-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.2}
          stroke="currentColor"
          className="w-5 h-5 text-white"
        >
          {/* Sparkle icon */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 21l8.982-11.795c.783-1.028-.08-2.502-1.34-2.502h-5.87l.813-5.096L4.6 13.402c-.783 1.028.08 2.502 1.34 2.502h5.87z"
          />
        </svg>
        {/* Floating Sparkle element */}
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 text-amber-300 drop-shadow-sm animate-pulse">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2L22 10l-6 5.4 1.8 7.8-6.8-4.8-6.8 4.8 1.8-7.8-6-5.4 7.6-.8L12 2z" />
          </svg>
        </div>
      </div>
      
      {!iconOnly && (
        <span className="text-xl font-bold tracking-tight text-slate-800">
          Clean<span className="bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">Up</span>
        </span>
      )}
    </div>
  );
}
