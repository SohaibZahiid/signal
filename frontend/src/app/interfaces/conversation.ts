import { Message } from "./message";
import { User } from "./user";

export interface Conversation {
  _id: string,
  members: User[],
  messages: Message[],
  lastMessage?: Message
}