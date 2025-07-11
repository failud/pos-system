import type { ActiveEntity } from "./ฺBaseType";

export interface SystemSetting extends ActiveEntity {
  key: string;
  value?: string;
  description?: string;
  category?: string;
}