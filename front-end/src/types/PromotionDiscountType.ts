import type { Product } from "./ProductType";
import type { ActiveEntity, BaseEntity, UUID } from "./ฺBaseType";

export type PromotionType = 'percentage' | 'fixed_amount' | 'buy_x_get_y';

export interface Promotion extends ActiveEntity {
  name: string;
  description?: string;
  type: PromotionType;
  value: number;
  min_purchase_amount: number;
  max_discount_amount?: number;
  start_date: string;
  end_date: string;
  products?: Product[];
}

export interface PromotionProduct extends BaseEntity {
  promotion_id: UUID;
  product_id: UUID;
  promotion?: Promotion;
  product?: Product;
}