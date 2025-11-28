import { useProductUpload } from "../hooks/useProductUpload";

interface UploadWidgetProps {
  onUploadSuccess: () => void;
}

export const UploadWidget = ({ onUploadSuccess }: UploadWidgetProps) => {
  const { files, progress, status, handleFileChange, upload } = useProductUpload(onUploadSuccess);

  return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Bulk Upload</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
          <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          <button
              onClick={upload}
              disabled={!files || files.length === 0}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-2.5 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
          >
            {progress > 0 && progress < 100 ? `Uploading ${progress}%` : "Start Upload"}
          </button>
        </div>

        {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
        )}
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
  );
};
