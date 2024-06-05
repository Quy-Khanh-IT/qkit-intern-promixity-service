export interface INotification {
  id: string
  title: string
  content: string
  type: string
  senderId: string
  receiverId: string | null
  isRead: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}
