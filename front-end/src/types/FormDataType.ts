import type { CustomerGender } from "./CustomerType";
import type { ProductUnit } from "./ProductType";
import type { PaymentMethodType } from "./SaleType";
import type { UserRole } from "./UserType";
import type { UUID } from "./ฺBaseType";

export interface CreateUserForm {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
}

export interface CreateProductForm {
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
}

export interface CreateSaleForm {
  customer_id?: UUID;
  items: {
    product_id: UUID;
    product_variant_id?: UUID;
    quantity: number;
    unit_price: number;
    discount_amount?: number;
  }[];
  payment_method: PaymentMethodType;
  notes?: string;
}

export interface CreateCustomerForm {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: CustomerGender;
}