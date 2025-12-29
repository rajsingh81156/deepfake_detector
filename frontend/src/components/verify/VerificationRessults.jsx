import { TrendingUp, Share2, Download, Eye, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

export default function VerificationResult({ result }) {
  if (!result) {
    return (
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-12 border border-white/20 flex flex-col items-center justify-center h-full relative overflow-hidden">
        <Shield className="w-20 h-20 text-purple-300 mb-4 animate-pulse relative" />
        <h3 className="text-lg font-bold text-white mb-2 relative">No Media Uploaded</h3>
        <p className="text-sm text-purple-200 text-center max-w-sm relative">
          Upload an image or video to verify its authenticity using our multi-layer Swiss Cheese Model
        </p>
      </div>
    );
  }

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

  const strokeColor = result.trustScore >= 95 ? '#10b981' : result.trustScore >= 60 ? '#f59e0b' : '#ef4444';

  const layerIcons = {
    pass: <CheckCircle className="w-5 h-5 text-green-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    fail: <XCircle className="w-5 h-5 text-red-400" />,
    unknown: <Info className="w-5 h-5 text-gray-400" />
  };

  return (
    <>
      {/* Trust Score */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <h2 className="text-xl font-bold text-white mb-6 relative flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-400" />
          Verification Results
        </h2>
        
        {/* Trust Score Meter */}
        <div className="flex justify-center mb-6">
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
                  strokeDasharray={`${(result.trustScore / 100) * 402} 402`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getColor(result.trustScore)}`}>{result.trustScore}</span>
                <span className="text-xs text-gray-500 font-medium">Trust Score</span>
              </div>
            </div>
            <span className={`text-sm font-semibold ${getColor(result.trustScore)} px-3 py-1 rounded-full bg-white shadow-md`}>
              {getLabel(result.trustScore)}
            </span>
          </div>
        </div>

        {/* Provenance Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20">
            <p className="text-xs text-purple-200 mb-1 font-medium">Source Device</p>
            <p className="text-sm font-bold text-white">{result.source}</p>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20">
            <p className="text-xs text-purple-200 mb-1 font-medium">Creator</p>
            <p className="text-sm font-bold text-white">{result.creator}</p>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20">
            <p className="text-xs text-purple-200 mb-1 font-medium">Timestamp</p>
            <p className="text-sm font-bold text-white">
              {new Date(result.timestamp).toLocaleDateString()}
            </p>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20">
            <p className="text-xs text-purple-200 mb-1 font-medium">Modifications</p>
            <p className="text-sm font-bold text-white">{result.modifications}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 backdrop-blur-md bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105 font-semibold">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 backdrop-blur-md bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105 font-semibold">
            <Download className="w-4 h-4" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Layer Analysis */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-4 relative flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-400" />
          Layer-by-Layer Analysis
        </h3>
        <div className="space-y-3 relative">
          {result.layers.map((layer, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center space-x-3">
                {layerIcons[layer.status]}
                <span className="text-sm font-semibold text-white">{layer.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-purple-200">
                  {layer.confidence > 0 ? `${layer.confidence}%` : 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}