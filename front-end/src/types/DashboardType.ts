import type { Product } from "./ProductType";

export interface DashboardStats {
  total_sales_today: number;
  total_transactions_today: number;
  total_customers_today: number;
  low_stock_products: number;
  popular_products: Array<{
    product: Product;
    quantity_sold: number;
    revenue: number;
  }>;
  sales_by_hour: Array<{
    hour: number;
    sales: number;
    transactions: number;
  }>;
}