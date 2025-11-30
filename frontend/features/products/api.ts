import { apiClient } from "@/lib/axios";
import { ProductRequest, ProductResponse } from "./types";

export const productApi = {
  getAll: async (req: ProductRequest = {}): Promise<ProductResponse> => {
    const { data } = await apiClient.get("/products", {
      params: {
        pageNo: req.pageNo ?? 0,
        pageSize: req.pageSize ?? 6,
        sortBy: req.sortBy ?? "id",
        sortType: req.sortType ?? "desc",
      },
    });
    return data;
  },

  upload: async (formData: FormData, onProgress: (percent: number) => void) => {
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
