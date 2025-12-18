import { useNavigate } from "react-router-dom";
import { History, Shield } from "lucide-react";

export default function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="group mb-10 inline-flex items-center gap-3 px-6 py-3 rounded-xl
                     bg-gradient-to-r from-blue-600 to-purple-600
                     text-white font-semibold shadow-xl
                     hover:from-blue-500 hover:to-purple-500
                     transition-all duration-300 hover:scale-105"
        >
          <span
            className="text-lg font-bold"
          >
            ←
          </span>
          <span className="tracking-wide">Back to Home</span>
        </button>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <History className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Verification History</h1>
              <p className="text-purple-200 text-sm">
                Track and review your previously verified media
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 mb-8" />

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-white/30 rounded-xl">
            <Shield className="w-16 h-16 text-purple-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No History Found</h3>
            <p className="text-purple-200 max-w-sm">
              You haven’t verified any media yet.  
              Start by uploading an image or video on the home page.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                         bg-white/10 hover:bg-white/20 border border-white/20
                         transition-all duration-300 hover:scale-105"
            >
              Go Verify Media
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
