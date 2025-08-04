// brand.interface.ts
export interface BrandWithProductCount {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  products?: any[];
  productCount: number;
}

export interface BrandOption {
  id: string;
  name: string;
  description?: string;
}
