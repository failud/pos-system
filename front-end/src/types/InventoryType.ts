import type { Product, ProductVariant } from "./ProductType";
import type { Store } from "./StoreType";
import type { User } from "./UserType";
import type { BaseEntity, UUID, ActiveEntity } from "./ฺBaseType";

export type MovementType = 'in' | 'out' | 'adjustment' | 'transfer';
export type ReferenceType = 'purchase' | 'sale' | 'adjustment' | 'transfer';

export interface StockMovement extends BaseEntity {
  product_id: UUID;
  product_variant_id?: UUID;
  store_id?: UUID;
  movement_type: MovementType;
  quantity: number;
  unit_cost?: number;
  reference_type?: ReferenceType;
  reference_id?: UUID;
  notes?: string;
  created_by?: UUID;
  
  // Relations
  product?: Product;
  product_variant?: ProductVariant;
  store?: Store;
  creator?: User;
}

export type PurchaseOrderStatus = 'pending' | 'approved' | 'received' | 'cancelled';

export interface PurchaseOrder extends ActiveEntity {
  order_number: string;
  supplier_id?: UUID;
  store_id?: UUID;
  status: PurchaseOrderStatus;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  order_date: string;
  expected_date?: string;
  received_date?: string;
  notes?: string;
  created_by?: UUID;
  
  // Relations
  supplier?: Supplier;
  store?: Store;
  creator?: User;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem extends BaseEntity {
  purchase_order_id: UUID;
  product_id?: UUID;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: number;
  total_cost: number;
  
  // Relations
  purchase_order?: PurchaseOrder;
  product?: Product;
}

export interface Supplier extends ActiveEntity {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  payment_terms?: string;
}