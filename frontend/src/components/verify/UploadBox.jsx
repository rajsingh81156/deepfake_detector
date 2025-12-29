import { Upload, XCircle } from "lucide-react";

export default function UploadBox({ file, onUpload, onRemove }) {
  if (!file) {
    return (
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-purple-400 transition-all duration-300 backdrop-blur-md bg-white/5 hover:bg-white/10 group relative">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-14 h-14 text-purple-300 mb-4 group-hover:scale-110 transition-transform duration-300" />
          <p className="mb-2 text-sm text-white font-semibold">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-purple-200">PNG, JPG, MP4, or WebM</p>
        </div>
        <input type="file" className="hidden" onChange={onUpload} accept="image/*,video/*" />
      </label>
    );
  }

  return (
    <div className="space-y-4 relative">
      <div className="relative rounded-xl overflow-hidden shadow-2xl">
        {file.type?.startsWith('video/') ? (
          <video src={file.preview || file} className="w-full h-64 object-cover" controls />
        ) : (
          <img src={file.preview || file} alt="Uploaded" className="w-full h-64 object-cover" />
        )}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}