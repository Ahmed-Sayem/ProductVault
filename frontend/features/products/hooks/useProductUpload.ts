import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api";

export const useProductUpload = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      resetStatus();
    }
  };

  const handleDrop = (droppedFiles: FileList) => {
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prev) => [...prev, ...newFiles]);
      resetStatus();
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const resetStatus = () => {
    setStatus("");
    setProgress(0);
  };

  const upload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setStatus("Uploading...");
      const response = await productApi.upload(formData, (percent) => setProgress(percent));

      if (response.failed && response.failed.length > 0) {
        setStatus(`Completed: ${response.successful?.length} saved, but ${response.failed.length} failed.`);
      } else {
        setStatus("Success! All files uploaded.");
      }

      setFiles([]);
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess();

      setTimeout(() => { setProgress(0); setStatus(""); }, 4000);
    } catch (error) {
      console.error(error);
      setStatus("Failed to upload.");
    }
  };

  return { files, progress, status, handleFileChange, handleDrop, removeFile, upload };
};
