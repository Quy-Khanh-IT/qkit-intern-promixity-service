export interface NotificationRepositoryInterface {
  markAllAsRead(userId: string): Promise<boolean>;
}
