import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { Conversation } from '../interfaces/conversation';
import { Message } from '../interfaces/message';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private API: string = environment.apiUrl
  private requestOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')!).token}`
    })
  }
  //Global states
  selectedUser = signal<User | undefined>(undefined)
  selectedUserMessages = signal<Message[]>([])
  userConversations = signal<Conversation[]>([])
  lastMessages = signal<{ senderId: string, receiverId: string, message: string }[] | undefined>(undefined)

  constructor(private http: HttpClient) { }

  sendMessage(receiverId: string, message: string) {
    return this.http.post<{ message: Message, conversation: Conversation }>(`${this.API}/message/${receiverId}`, { message }, this.requestOptions)
  }

  getMessages(receiverId: string) {
    return this.http.get<Message[]>(`${this.API}/message/${receiverId}`, this.requestOptions)
  }

  getUserConversations() {
    return this.http.get<Conversation[]>(`${this.API}/conversation`, this.requestOptions);
  }

  conversationExists(senderId: string, receiverId: string) {
    return this.userConversations().some(conversation => {
      const membersIds = conversation.members.map(member => member._id)
      return membersIds.includes(senderId) && membersIds.includes(receiverId)
    })
  }

}
