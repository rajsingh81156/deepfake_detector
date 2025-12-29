import { Shield, Lock } from "lucide-react";

export default function VerifyInfoCard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 hover:scale-105 transition-transform duration-300 shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-blue-300" />
          <h3 className="font-bold text-white">Multi-Layer</h3>
        </div>
        <p className="text-sm text-blue-200">6+ verification layers for maximum accuracy</p>
      </div>
      
      <div className="backdrop-blur-xl bg-purple-500/20 border border-purple-400/30 rounded-xl p-4 hover:scale-105 transition-transform duration-300 shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Lock className="w-5 h-5 text-purple-300" />
          <h3 className="font-bold text-white">Blockchain</h3>
        </div>
        <p className="text-sm text-purple-200">Immutable provenance tracking</p>
      </div>
    </div>
  );
}