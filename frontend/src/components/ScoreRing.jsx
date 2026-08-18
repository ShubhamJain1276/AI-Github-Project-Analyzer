export default function ScoreRing({ score, maxScore = 100, size = 120, strokeWidth = 8, color = '#2563EB', label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(score / maxScore, 1);
  const offset = circumference - percentage * circumference;

  const getColor = () => {
    if (percentage >= 0.7) return '#059669';
    if (percentage >= 0.4) return '#F59E0B';
    return '#ef4444';
  };

  const ringColor = color === 'auto' ? getColor() : color;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={ringColor} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="score-ring transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{score}</span>
          <span className="text-xs text-slate-400">/ {maxScore}</span>
        </div>
      </div>
      {label && <span className="text-sm font-medium text-slate-600 text-center">{label}</span>}
    </div>
  );
}
