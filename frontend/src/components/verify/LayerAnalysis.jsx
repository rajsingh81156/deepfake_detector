import { CheckCircle, AlertTriangle, XCircle, Info, Eye } from "lucide-react";

export default function LayerAnalysis({ layers }) {
  const icons = {
    pass: <CheckCircle className="w-5 h-5 text-green-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    fail: <XCircle className="w-5 h-5 text-red-400" />,
    unknown: <Info className="w-5 h-5 text-gray-400" />
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      <h3 className="text-lg font-bold text-white mb-4 relative flex items-center gap-2">
        <Eye className="w-5 h-5 text-purple-400" />
        Layer-by-Layer Analysis
      </h3>
      <div className="space-y-3 relative">
        {layers.map((layer, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              {icons[layer.status]}
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
  );
}