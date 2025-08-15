import type { ActiveEntity, BaseEntity, UUID } from "./ฺBaseType";

export type CustomerGender = 'male' | 'female' | 'other';

export interface Customer extends ActiveEntity {
  customer_code?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: CustomerGender;
  loyalty_points: number;
  total_spent: number;
  full_name?: string;
  groups?: CustomerGroup[];
}

export interface CustomerGroup extends ActiveEntity {
  name: string;
  description?: string;
  discount_percentage: number;
  min_purchase_amount: number;
}

export interface CustomerGroupMember extends BaseEntity {
  customer_id: UUID;
  group_id: UUID;
  joined_at: string;
  customer?: Customer;
  group?: CustomerGroup;
}

export interface CustomerInput {
  customerCode: string,
  first_name?: string,
  last_name?: string,
  email: string,
  phone: string,
  address?: string,
  date_of_birth?: string,
  gender?: string,
  loyalty_points?: number,
  total_spent?: number,
  isActive: boolean
}