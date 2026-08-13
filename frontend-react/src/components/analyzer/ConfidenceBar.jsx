import React, { useEffect, useState } from 'react';

const ConfidenceBar = ({ percent, isReal }) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const color = isReal ? '#22c55e' : '#ef4444';

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercent(percent), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  // Circular gauge
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercent / 100) * circumference;

  return (
    <div className="flex items-center gap-6">
      {/* Circular Gauge */}
      <div className="relative flex-shrink-0">
        <svg width="110" height="110" viewBox="0 0 110 110" className="confidence-ring" style={{ color }}>
          {/* Background circle */}
          <circle cx="55" cy="55" r={radius} fill="none" stroke="#334155" strokeWidth="8" />
          {/* Animated fill circle */}
          <circle
            cx="55" cy="55" r={radius} fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'rotate(0deg)' }}>
          <span className="text-2xl font-bold text-white">{animatedPercent}%</span>
        </div>
      </div>

      {/* Bar + Label */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm font-medium">Confidence Score</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
            {isReal ? 'Credible' : 'Suspicious'}
          </span>
        </div>
        <div className="confidence-bar-bg w-full h-3 rounded-full overflow-hidden">
          <div
            className="confidence-bar-fill h-full rounded-full"
            style={{ width: `${animatedPercent}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfidenceBar;
