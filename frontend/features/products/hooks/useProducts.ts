import { useState } from "react";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api";

export const useProducts = (pageSize = 6) => {
  const [currentPage, setCurrentPage] = useState(0);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['products', currentPage, pageSize],

    // The Fetch Function
    queryFn: () => productApi.getAll({
      pageNo: currentPage,
      pageSize: pageSize,
      sortBy: "id",
      sortType: "desc"
    }),

    placeholderData: keepPreviousData,
  });

  const products = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const changePage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return {
    products,
    loading: isLoading,
    currentPage,
    totalPages,
    totalElements,
    changePage,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  };
};
