export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
  is_active?: boolean;
}