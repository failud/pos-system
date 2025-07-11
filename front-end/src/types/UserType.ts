import type { ActiveEntity, BaseEntity, UUID } from "./ฺBaseType";

export type UserRole = 'admin' | 'manager' | 'cashier';

export interface User extends ActiveEntity {
  username: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
}

export interface UserSession extends BaseEntity {
  user_id: UUID;
  token: string;
  expires_at: string;
}

export interface UserProfile extends Omit<User, 'password_hash'> {
  full_name?: string;
}