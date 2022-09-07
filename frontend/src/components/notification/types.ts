export type NotificationStyle =
  | "error"
  | "success"
  | "warning"
  | "info"
  | "none";

export interface NotificationOptions {
  html?: boolean;
  closable?: boolean;
  timeout?: number | false;
  style?: NotificationStyle;
}

export interface Notification extends NotificationOptions {
  id: string;
  message: string;
}
