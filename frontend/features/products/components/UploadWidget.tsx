import { useState, useRef, useEffect } from "react";
import { useProductUpload } from "../hooks/useProductUpload";

interface UploadWidgetProps {
  onUploadSuccess: () => void;
}

export const UploadWidget = ({ onUploadSuccess }: UploadWidgetProps) => {
  const {
    files,
    progress,
    status,
    handleFileChange,
    handleDrop,
    removeFile,
    upload
  } = useProductUpload(onUploadSuccess);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleDrop(e.dataTransfer.files);
  };

  const MAX_PREVIEW = 15;
  const visibleFiles = files.slice(0, MAX_PREVIEW);
  const hiddenCount = files.length - MAX_PREVIEW;

  return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Bulk Upload</h2>
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
          border-2 border-dashed rounded-xl p-8 mb-6 text-center cursor-pointer transition-all duration-200
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
        `}
        >
          <input type="file" multiple accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />

          <div className="flex flex-col items-center justify-center gap-2">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <div className="text-gray-600">
              <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
          </div>
        </div>

        {files.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Selected Files ({files.length})</p>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">

                {visibleFiles.map((file, index) => (
                    <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                      />

                      <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 transition opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <span className="absolute bottom-1 right-1 text-[10px] bg-black/60 text-white px-1 rounded">
                  {(file.size / 1024).toFixed(0)}KB
                </span>
                    </div>
                ))}

                {hiddenCount > 0 && (
                    <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-medium text-sm">+{hiddenCount} more</span>
                    </div>
                )}
              </div>
            </div>
        )}

        <div className="flex flex-col gap-4">
          {files.length > 0 && (
              <button
                  onClick={upload}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
              >
                {progress > 0 && progress < 100 ? `Uploading... ${progress}%` : `Upload ${files.length} Files`}
              </button>
          )}

          {progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
          )}
          {status && <p className={`text-sm text-center font-medium ${status.includes("Failed") ? "text-red-500" : "text-green-600"}`}>{status}</p>}
        </div>
      </div>
  );
};
