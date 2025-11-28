import { apiClient } from "@/lib/axios";
import { Product } from "./types";

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await apiClient.get("/products");
    return data;
  },

  upload: async (formData: FormData, onProgress: (percent: number) => void): Promise<Product[]> => {
    const { data } = await apiClient.post("/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (ev) => {
        const percent = Math.round((ev.loaded * 100) / (ev.total || 1));
        onProgress(percent);
      },
    });
    return data;
  },
};
