import { Upload, XCircle } from "lucide-react";

export default function UploadBox({ file, onUpload, onRemove }) {
  if (!file) {
    return (
      <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:border-blue-500">
        <Upload className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-sm text-gray-500">Click or drag file to upload</p>
        <input type="file" className="hidden" onChange={onUpload} />
      </label>
    );
  }

  return (
    <div className="relative">
      <img src={file} className="w-full h-64 object-cover rounded-lg" />
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
      >
        <XCircle />
      </button>
    </div>
  );
}
