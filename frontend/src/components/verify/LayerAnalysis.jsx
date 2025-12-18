import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

export default function LayerAnalysis({ layers }) {
  const icons = {
    pass: <CheckCircle className="text-green-600" />,
    warning: <AlertTriangle className="text-yellow-600" />,
    fail: <XCircle className="text-red-600" />,
    unknown: <Info className="text-gray-400" />
  };

  return layers.map((layer, i) => (
    <div key={i} className="flex justify-between bg-gray-50 p-3 rounded">
      <div className="flex gap-2">
        {icons[layer.status]} {layer.name}
      </div>
      <span>{layer.confidence ? `${layer.confidence}%` : "N/A"}</span>
    </div>
  ));
}
