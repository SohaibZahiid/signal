import { User } from "./user";

export interface Conversation {
  _id: string,
  members: User[]
}