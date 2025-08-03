
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}


export interface CategoryCreate {
  name: string;
  description?: string;
}


export interface CategoryUpdate {
  name?: string;
  description?: string;
}

export interface CategoryListResponse {
  items: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryResponse {
  success: boolean;
  data?: Category | CategoryListResponse;
  error?: string;
}
