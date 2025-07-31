

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
}

export interface CategoryInput {
    name: string;
    description: string;
    isActive: boolean;
}