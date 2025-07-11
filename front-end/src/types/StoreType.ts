import type { User } from "./UserType";
import type { ActiveEntity, BaseEntity, UUID } from "./ฺBaseType";

export interface Store extends ActiveEntity {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  tax_id?: string;
}

export interface StoreUser extends BaseEntity {
  store_id: UUID;
  user_id: UUID;
  is_active: boolean;
  store?: Store;
  user?: User;
}