export default function TrustScoreMeter({ score }) {
  const getColor = (s) => {
    if (s >= 95) return 'text-green-600';
    if (s >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLabel = (s) => {
    if (s >= 95) return 'Highly Trusted';
    if (s >= 60) return 'Moderately Trusted';
    return 'Low Trust';
  };

  const strokeColor = score >= 95 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative w-36 h-36">
        <svg className="transform -rotate-90 w-36 h-36">
          <circle cx="72" cy="72" r="64" stroke="#e5e7eb" strokeWidth="10" fill="none" />
          <circle
            cx="72"
            cy="72"
            r="64"
            stroke={strokeColor}
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${(score / 100) * 402} 402`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${getColor(score)}`}>{score}</span>
          <span className="text-xs text-gray-500 font-medium">Trust Score</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${getColor(score)} px-3 py-1 rounded-full bg-white shadow-md`}>
        {getLabel(score)}
      </span>
    </div>
  );
}