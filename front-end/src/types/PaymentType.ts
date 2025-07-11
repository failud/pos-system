import type { Sale } from "./SaleType";
import type { ActiveEntity, BaseEntity, UUID } from "./ฺBaseType";

export type PaymentType = 'cash' | 'card' | 'bank_transfer' | 'e_wallet';
export type PaymentMethodStatus = 'completed' | 'pending' | 'failed';

export interface PaymentMethod extends ActiveEntity {
  name: string;
  type: PaymentType;
}

export interface Payment extends BaseEntity {
  sale_id: UUID;
  payment_method_id?: UUID;
  amount: number;
  reference_number?: string;
  payment_date: string;
  status: PaymentMethodStatus;
  notes?: string;
  
  // Relations
  sale?: Sale;
  payment_method?: PaymentMethod;
}