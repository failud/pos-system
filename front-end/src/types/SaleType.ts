import type { Customer } from "./CustomerType";
import type { Payment } from "./PaymentType";
import type { Product, ProductVariant } from "./ProductType";
import type { Store } from "./StoreType";
import type { User } from "./UserType";
import type { ActiveEntity, UUID, BaseEntity } from "./ฺBaseType";

export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded';
export type SaleStatus = 'completed' | 'cancelled' | 'returned';
export type PaymentMethodType = 'cash' | 'card' | 'transfer' | 'mixed';

export interface Sale extends ActiveEntity {
  sale_number: string;
  store_id?: UUID;
  cashier_id?: UUID;
  customer_id?: UUID;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_status: PaymentStatus;
  sale_status: SaleStatus;
  payment_method?: PaymentMethodType;
  notes?: string;
  
  // Relations
  store?: Store;
  cashier?: User;
  customer?: Customer;
  items?: SaleItem[];
  payments?: Payment[];
}

export interface SaleItem extends BaseEntity {
  sale_id: UUID;
  product_id?: UUID;
  product_variant_id?: UUID;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  
  // Relations
  sale?: Sale;
  product?: Product;
  product_variant?: ProductVariant;
}