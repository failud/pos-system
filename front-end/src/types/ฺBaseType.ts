export type UUID = string;

export interface BaseEntity {
  id: UUID;
  created_at: string;
  updated_at?: string;
}

export interface ActiveEntity extends BaseEntity {
  is_active: boolean;
}