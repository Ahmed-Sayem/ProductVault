import { useState } from "react";
import { productApi } from "../api";

export const useProductUpload = (onSuccess: () => void) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
      setStatus("");
      setProgress(0);
    }
  };

  const upload = async () => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      setStatus("Uploading...");
      await productApi.upload(formData, (percent) => setProgress(percent));

      setStatus("Success!");
      setFiles(null);
      onSuccess();

      setTimeout(() => { setProgress(0); setStatus(""); }, 2000);
    } catch (error) {
      console.error(error);
      setStatus("Failed to upload.");
    }
  };

  return { files, progress, status, handleFileChange, upload };
};
