import { useState, useRef } from "react";
import { useProductUpload } from "../hooks/useProductUpload";

interface UploadWidgetProps {
  onUploadSuccess: () => void;
}

export const UploadWidget = ({ onUploadSuccess }: UploadWidgetProps) => {
  const { files, progress, status, handleFileChange, handleDrop, upload } = useProductUpload(onUploadSuccess);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDrop(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Bulk Upload</h2>
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={handleClick}
            className={`
          border-2 border-dashed rounded-xl p-8 mb-6 text-center cursor-pointer transition-all duration-200
          ${isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }
        `}
        >
          <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
          />

          {/* Icon */}
          <div className="flex flex-col items-center justify-center gap-2">
            <svg className={`w-10 h-10 ${isDragging ? "text-blue-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>

            <div className="text-gray-600">
              {files && files.length > 0 ? (
                  <span className="font-semibold text-blue-600">{files.length} file(s) selected</span>
              ) : (
                  <>
                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                  </>
              )}
            </div>
            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
          </div>
        </div>

        {/* --- ACTION BUTTON & PROGRESS --- */}
        <div className="flex flex-col gap-4">
          {files && files.length > 0 && (
              <button
                  onClick={upload}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
              >
                {progress > 0 && progress < 100 ? `Uploading... ${progress}%` : "Upload Files Now"}
              </button>
          )}

          {/* Progress Bar */}
          {progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
          )}

          {status && (
              <p className={`text-sm text-center font-medium ${status.includes("Failed") ? "text-red-500" : "text-green-600"}`}>
                {status}
              </p>
          )}
        </div>
      </div>
  );
};
