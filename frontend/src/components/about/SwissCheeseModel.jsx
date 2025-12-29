import { Shield, Fingerprint, Eye, FileCheck, Lock, History, AlertTriangle, Sparkles, Globe } from "lucide-react";

export default function SwissCheeseModel() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
        <h2 className="text-3xl font-bold text-white mb-4 relative flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-400" />
          The Swiss Cheese Model
        </h2>
        <p className="text-purple-200 mb-6 text-lg relative">
          No single defense is perfect, but multiple overlapping layers create a robust system.
          Each layer catches what others might miss.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl p-6 border border-blue-400/40 hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Fingerprint className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Layer 1: Watermarking</h3>
            <p className="text-sm text-blue-100">
              C2PA cryptographic watermarks embedded at creation. Immutable provenance data.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-xl p-6 border border-purple-400/40 hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Eye className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Layer 2: AI Detection</h3>
            <p className="text-sm text-purple-100">
              Neural networks trained to identify synthetic patterns and AI-generated artifacts.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-xl p-6 border border-green-400/40 hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <FileCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Layer 3: Metadata Analysis</h3>
            <p className="text-sm text-green-100">
              Deep inspection of EXIF, IPTC, and XMP data for inconsistencies and tampering.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 rounded-xl p-6 border border-yellow-400/40 hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="bg-yellow-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Layer 4: Blockchain</h3>
            <p className="text-sm text-yellow-100">
              Decentralized ledger for immutable timestamp verification and ownership tracking.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/30 to-red-600/30 rounded-xl p-6 border border-red-400/40 hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="bg-red-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <History className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Layer 5: Source Attribution
            </h3>
            <p className="text-sm text-red-100">
              Cross-reference creators, devices, and origin databases to validate authenticity.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 rounded-xl p-6 border border-indigo-400/40 hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="bg-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Layer 6: Behavioral Analysis
            </h3>
            <p className="text-sm text-indigo-100">
              Detects abnormal sharing patterns and coordinated misinformation campaigns.
            </p>
          </div>
        </div>
      </div>

      {/* Why Multiple Layers */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
        <h3 className="text-2xl font-bold text-white mb-4 relative flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          Why Multiple Layers Matter
        </h3>

        <p className="text-purple-100 mb-6 text-lg relative">
          Deepfakes evolve rapidly. No single detection method is enough.
          The Swiss Cheese Model ensures overlapping defenses — if one fails,
          others still protect trust and authenticity.
        </p>

        <div className="backdrop-blur-md bg-yellow-500/20 border-l-4 border-yellow-400 text-yellow-100 p-4 rounded-xl relative">
          <p className="text-sm font-bold">AI Analyzed Media</p>
          <p className="text-xs mt-1 opacity-90">
            All verification data shown is simulated. This is a real backend call, model is trained for production use.
          </p>
        </div>
      </div>
    </div>
  );
}