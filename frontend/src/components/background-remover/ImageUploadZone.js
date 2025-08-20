import React from "react";
import { Upload } from "lucide-react";

export default function ImageUploadZone({ onFileSelect, dragActive, setDragActive }) {
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
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleChange}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-3">
          <Upload className="w-8 h-8 text-blue-500" />
          <p className="text-lg text-slate-600">點擊或拖放圖片到這裡</p>
          <p className="text-sm text-slate-500">支援 JPG、PNG，最大 5MB</p>
        </div>
      </label>
    </div>
  );
}
