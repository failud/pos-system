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

export interface UserInput {
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  phone: string | null,
  role: string,
  is_active: boolean,
  password?: string;
}

// username: values.username,
// email: values.email,
// first_name: values.first_name,
// last_name: values.last_name,
// phone: values.phone || null,
// role: values.role,
// is_active: values.isActive !== undefined ? values.isActive : true,