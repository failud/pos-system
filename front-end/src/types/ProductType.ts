import type { ActiveEntity, UUID } from "./ฺBaseType";

export interface Category extends ActiveEntity {
  name: string;
  description?: string;
  parent_id?: UUID;
  parent?: Category;
  children?: Category[];
}

export interface Brand extends ActiveEntity {
  name: string;
  description?: string;
}

export type ProductUnit = 'piece' | 'kg' | 'liter' | 'meter' | 'box';

export interface Product extends ActiveEntity {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category_id?: UUID;
  brand_id?: UUID;
  cost_price: number;
  selling_price: number;
  discount_price?: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level?: number;
  unit: ProductUnit;
  tax_rate: number;
  image_url?: string;
  
  // Relations
  category?: Category;
  brand?: Brand;
  variants?: ProductVariant[];
}

export interface ProductVariant extends ActiveEntity {
  product_id: UUID;
  variant_name: string;
  variant_value: string;
  price_adjustment: number;
  stock_quantity: number;
  sku?: string;
  product?: Product;
}