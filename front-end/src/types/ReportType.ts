import type { Store } from "./StoreType";
import type { ActiveEntity, UUID } from "./ฺBaseType";

export interface DailySalesSummary extends ActiveEntity {
  store_id?: UUID;
  sale_date: string;
  total_sales: number;
  total_transactions: number;
  total_customers: number;
  total_tax: number;
  total_discount: number;
  cash_sales: number;
  card_sales: number;
  store?: Store;
}