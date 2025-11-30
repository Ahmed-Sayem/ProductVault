export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export interface ProductResponse {
  content: Product[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ProductRequest {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortType?: string;
}
