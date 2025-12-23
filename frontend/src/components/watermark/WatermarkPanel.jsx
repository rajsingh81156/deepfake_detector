import { useState, useRef } from "react";
import { Camera, FileText, Lock, Clock, CheckCircle, Upload, X, Fingerprint, Shield, Info } from "lucide-react";

export default function WatermarkPanel() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setSelectedFile(file);
      setIsProcessed(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image or video file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleProcessWatermark = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:5000/api/watermark", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Watermark failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setPreviewUrl(url);
      setIsProcessed(true);
    } catch (err) {
      console.error(err);
      alert("Watermarking failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsProcessed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (!previewUrl) return;

    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `watermarked_${selectedFile?.name || "file"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Main Content Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Fingerprint className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Add C2PA Watermark</h1>
              <p className="text-purple-200">Establish provenance for your content</p>
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 mb-8 transition-all duration-300 ${dragActive
                ? 'border-blue-400 bg-blue-500/10'
                : selectedFile
                  ? 'border-green-400 bg-green-500/10'
                  : 'border-white/30 bg-white/5 hover:border-white/50'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {!selectedFile ? (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Upload your original content</h3>
                <p className="text-purple-200 mb-6">We'll embed a cryptographic watermark</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl"
                >
                  Choose File
                </button>

                <p className="text-purple-300 text-sm mt-4">or drag and drop your file here</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {previewUrl && selectedFile.type.startsWith('image/') && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 rounded-xl mb-4 shadow-xl"
                  />
                )}
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 mb-4">
                  <FileText className="w-6 h-6 text-green-400" />
                  <div className="flex-1">
                    <p className="text-white font-semibold">{selectedFile.name}</p>
                    <p className="text-purple-300 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {!isProcessing && !isProcessed && (
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-red-400" />
                    </button>
                  )}
                </div>

                {!isProcessed && (
                  <button
                    onClick={handleProcessWatermark}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Embedding Watermark...</span>
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-5 h-5" />
                        <span>Add C2PA Watermark</span>
                      </>
                    )}
                  </button>
                )}

                {isProcessed && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 bg-green-500/20 border-2 border-green-400 rounded-xl px-6 py-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <span className="text-white font-semibold">Watermark Successfully Added!</span>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleDownload}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={handleRemoveFile}
                        className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                      >
                        Upload Another
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30">
              <div className="w-12 h-12 rounded-xl bg-purple-500/30 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Cryptographic</h3>
              <p className="text-purple-200 text-sm">Tamper-proof digital signature</p>
            </div>

            <div className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 backdrop-blur-md rounded-2xl p-6 border border-blue-400/30">
              <div className="w-12 h-12 rounded-xl bg-blue-500/30 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Chain of Custody</h3>
              <p className="text-blue-200 text-sm">Track every modification</p>
            </div>

            <div className="bg-gradient-to-br from-teal-600/30 to-teal-800/30 backdrop-blur-md rounded-2xl p-6 border border-teal-400/30">
              <div className="w-12 h-12 rounded-xl bg-teal-500/30 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-300" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Standards Based</h3>
              <p className="text-teal-200 text-sm">C2PA & IPTC compliant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}