export type NotificationType = 'SYSTEM' | 'ORDER' | 'PAYMENT' | 'USER';

export interface NotificationSender {
  id: string;
  name?: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  sender?: NotificationSender;
  createdAt: string;
  updatedAt: string;
}
