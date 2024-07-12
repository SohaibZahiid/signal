export interface Message {
  _id?: string,
  conversationId: string
  senderId: string;
  receiverId: string
  message: string,
  createdAt?: string
}