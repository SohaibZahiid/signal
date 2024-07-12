import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { Conversation } from '../interfaces/conversation';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private API: string = "http://localhost:3000"
  private requestOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')!).token}`
    })
  }
  //Global states
  selectedUser = signal<User | undefined>(undefined)
  selectedUserMessages = signal<Message[]>([])
  conversationsLastMessages = signal<Message[]>([])
  userConversations = signal<Conversation[]>([])

  constructor(private http: HttpClient) { }

  getUsersLastMessages() {
    return this.http.get<Message[]>(`${this.API}/message`, this.requestOptions)
  }

  getConversationsMessages(conversationIds: string[]) {
    return this.http.get<Message[]>(`${this.API}/message/${conversationIds}`, this.requestOptions)
  }

  getUserMessages(conversationId: string) {
    return this.http.get<Message[]>(`${this.API}/message/${conversationId}`, this.requestOptions)
  }

  sendMessage(message: Message) {
    return this.http.post<Message>(`${this.API}/message`, message, this.requestOptions)
  }

  createConversation(senderId: string, receiverId: string) {
    return this.http.post<Conversation>(`${this.API}/conversation`, { senderId, receiverId }, this.requestOptions)
  }

  getConversations(userId: string) {
    return this.http.get<Conversation[]>(`${this.API}/conversation/${userId}`, this.requestOptions)
  }

  getUsersByUsername(username: string) {
    return this.http.get<User[]>(`${this.API}/auth/users?username=${username}`, this.requestOptions)
  }

}
