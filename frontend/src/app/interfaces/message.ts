export interface Message {
  _id?: string,
  senderId: string;
  receiverId: string
  message: string,
  seen?: boolean,
  createdAt?: string
}