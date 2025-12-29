import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Shield, Upload, Camera, FileCheck, AlertTriangle, CheckCircle, XCircle, Info, Lock, Fingerprint, Eye, History, Share2, Download, UserPlus, Sparkles, Zap, TrendingUp, Globe } from 'lucide-react';
import WatermarkPanel from '../components/watermark/WatermarkPanel';

const VeriMedia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('verify');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/verify' || path === '/') {
      setActiveTab('verify');
    } else if (path === '/watermark') {
      setActiveTab('watermark');
    } else if (path === '/about') {
      setActiveTab('about');
    }
  }, [location.pathname]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile({
      file,
      preview: URL.createObjectURL(file)
    });

    setVerificationResult(null);
  };

  const handleRemoveFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile);
    }
    setUploadedFile(null);
    setVerificationResult(null);
  };

  const analyzeMedia = async () => {
    if (!uploadedFile?.file) return;

    try {
      setIsAnalyzing(true);

      const formData = new FormData();
      formData.append("file", uploadedFile.file);

      const res = await fetch("http://localhost:5000/api/verify", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Verification failed");
      }

      const raw = await res.json();

      const formattedResult = {
        trustScore: raw.trustScore ?? Math.floor((raw.confidence ?? 0.7) * 100),
        source: raw.source ?? "Unknown Device",
        creator: raw.creator ?? "Unknown",
        timestamp: raw.timestamp ?? new Date().toISOString(),
        modifications: raw.modifications ?? 0,
        layers: raw.layers ?? [
          {
            name: "AI Deepfake Detection",
            status: raw.prediction === "FAKE" ? "fail" : "pass",
            confidence: Math.round(raw.confidence * 100)
          },
          {
            name: "Metadata Analysis",
            status: "unknown",
            confidence: 0
          },
          {
            name: "Behavioral Signals",
            status: "unknown",
            confidence: 0
          }
        ]
      };

      setVerificationResult(formattedResult);
    } catch (error) {
      console.error(error);
      alert("Error verifying media");
    } finally {
      setIsAnalyzing(false);
    }
  };



  const TrustScoreMeter = ({ score }) => {
    const getColor = (s) => {
      if (s >= 85) return 'text-green-600';
      if (s >= 70) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getLabel = (s) => {
      if (s >= 85) return 'Highly Trusted';
      if (s >= 70) return 'Moderately Trusted';
      return 'Low Trust';
    };

    const strokeColor = score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';

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
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2.5 rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  VeriMedia
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                </h1>
                <p className="text-sm text-purple-200">Trust & Provenance Ecosystem</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/history")}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <History className="w-4 h-4" />
                <span>History</span>
              </button>

              <button
                onClick={() => navigate("/login")}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                <Lock className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => navigate("/register")}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105">
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 backdrop-blur-xl bg-white/10 p-1.5 rounded-2xl mb-8 border border-white/20 shadow-2xl">
          <button
            onClick={() => navigate('/verify')}
            className={`flex-1 flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'verify'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
              : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
          >
            <FileCheck className="w-5 h-5" />
            <span>Verify Media</span>
          </button>
          <button
            onClick={() => navigate('/watermark')}
            className={`flex-1 flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'watermark'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
              : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
          >
            <Fingerprint className="w-5 h-5" />
            <span>Add Watermark</span>
          </button>
          <button
            onClick={() => navigate('/about')}
            className={`flex-1 flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'about'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
              : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
          >
            <Info className="w-5 h-5" />
            <span>Swiss Cheese Model</span>
          </button>
        </div>

        {/* Verify Tab */}
        {activeTab === 'verify' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 relative">
                  <Upload className="w-6 h-6 text-blue-400" />
                  Upload Media for Verification
                </h2>

                {!uploadedFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-purple-400 transition-all duration-300 backdrop-blur-md bg-white/5 hover:bg-white/10 group relative">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-14 h-14 text-purple-300 mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <p className="mb-2 text-sm text-white font-semibold">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-purple-200">PNG, JPG, MP4, or WebM</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                  </label>
                ) : (
                  <div className="space-y-4 relative">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl">
                      {uploadedFile.file.type.startsWith('video/') ? (
                        <video src={uploadedFile.preview} className="w-full h-64 object-cover" controls />
                      ) : (
                        <img src={uploadedFile.preview} alt="Uploaded" className="w-full h-64 object-cover" />
                      )}
                      <button
                        onClick={handleRemoveFile}
                        className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      onClick={analyzeMedia}
                      disabled={isAnalyzing}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-purple-500 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      {isAnalyzing ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Analyzing with AI...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          <span>Verify Authenticity</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 hover:scale-105 transition-transform duration-300 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-300" />
                    <h3 className="font-bold text-white">Multi-Layer</h3>
                  </div>
                  <p className="text-sm text-blue-200">6 verification layers for maximum accuracy</p>
                </div>
                <div className="backdrop-blur-xl bg-purple-500/20 border border-purple-400/30 rounded-xl p-4 hover:scale-105 transition-transform duration-300 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="w-5 h-5 text-purple-300" />
                    <h3 className="font-bold text-white">Blockchain</h3>
                  </div>
                  <p className="text-sm text-purple-200">Immutable provenance tracking</p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {verificationResult ? (
                <>
                  {/* Trust Score */}
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
                    <h2 className="text-xl font-bold text-white mb-6 relative flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                      Verification Results
                    </h2>
                    <div className="flex justify-center mb-6">
                      <TrustScoreMeter score={verificationResult.trustScore} />
                    </div>

                    {/* Provenance Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20">
                        <p className="text-xs text-purple-200 mb-1 font-medium">Source Device</p>
                        <p className="text-sm font-bold text-white">{verificationResult.source}</p>
                      </div>
                      <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20">
                        <p className="text-xs text-purple-200 mb-1 font-medium">Creator</p>
                        <p className="text-sm font-bold text-white">{verificationResult.creator}</p>
                      </div>
                      <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20">
                        <p className="text-xs text-purple-200 mb-1 font-medium">Timestamp</p>
                        <p className="text-sm font-bold text-white">
                          {new Date(verificationResult.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20">
                        <p className="text-xs text-purple-200 mb-1 font-medium">Modifications</p>
                        <p className="text-sm font-bold text-white">{verificationResult.modifications}</p>
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
                      {verificationResult.layers.map((layer, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                          <div className="flex items-center space-x-3">
                            {layer.status === 'pass' && <CheckCircle className="w-5 h-5 text-green-400" />}
                            {layer.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                            {layer.status === 'fail' && <XCircle className="w-5 h-5 text-red-400" />}
                            {layer.status === 'unknown' && <Info className="w-5 h-5 text-gray-400" />}
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
              ) : (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-12 border border-white/20 flex flex-col items-center justify-center h-full relative overflow-hidden">
                  <Shield className="w-20 h-20 text-purple-300 mb-4 animate-pulse relative" />
                  <h3 className="text-lg font-bold text-white mb-2 relative">No Media Uploaded</h3>
                  <p className="text-sm text-purple-200 text-center max-w-sm relative">
                    Upload an image or video to verify its authenticity using our multi-layer Swiss Cheese Model
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Watermark Tab */}
        {activeTab === 'watermark' && (
          <WatermarkPanel />
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
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
                <p className="text-sm font-bold">AI Analyzed Media </p>
                <p className="text-xs mt-1 opacity-90">
                  All verification data shown is simulated. This is a real backend call , model is trained for production use.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VeriMedia;