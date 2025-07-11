import type { Customer } from "./CustomerType";
import type { Product, ProductVariant } from "./ProductType";

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total_price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  customer?: Customer;
}