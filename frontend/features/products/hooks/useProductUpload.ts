import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api";

export const useProductUpload = (onSuccess: () => void) => {
  const queryClient = useQueryClient();

  const [files, setFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const valid = validateFiles(e.target.files);
      if (valid.length > 0) {
        setFiles(e.target.files);
        resetStatus();
      }
    }
  };

  const handleDrop = (droppedFiles: FileList) => {
    if (droppedFiles.length > 0) {
      const valid = validateFiles(droppedFiles);
      if (valid.length > 0) {
        setFiles(droppedFiles);
        resetStatus();
      }
    }
  };

  const resetStatus = () => {
    setStatus("");
    setProgress(0);
  };

  const upload = async () => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      setStatus("Uploading...");
      const response = await productApi.upload(formData, (percent) => setProgress(percent));

      if (response.failed && response.failed.length > 0) {
        const successCount = response.successful ? response.successful.length : 0;
        const failCount = response.failed.length;

        setStatus(`Completed: ${successCount} saved, but ${failCount} failed.`);
        console.warn("The following files failed to upload:", response.failed);
      } else {
        setStatus("Success! All files uploaded.");
      }

      setFiles(null);

      await queryClient.invalidateQueries({ queryKey: ['products'] });

      onSuccess();

      setTimeout(() => {
        setProgress(0);
        setStatus("");
      }, 4000);

    } catch (error) {
      console.error(error);
      setStatus("Failed to upload.");
    }
  };

  const validateFiles = (incomingFiles: FileList): File[] => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(incomingFiles).forEach(file => {
      if (file.type.startsWith("image/")) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      alert(`Skipped invalid files (only images allowed): \n${invalidFiles.join("\n")}`);
    }

    return validFiles;
  };

  return { files, progress, status, handleFileChange, handleDrop, upload };
};
