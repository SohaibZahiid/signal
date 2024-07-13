import { Injectable, OnDestroy, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/message';
import { Conversation } from '../interfaces/conversation';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket = signal<Socket | undefined>(undefined)
  onlineUsers = signal<string[]>([])

  constructor(private authService: AuthService) {
  }


  getOnlineUsers() {
    if (this.authService.loggedInUser()) {
      const socket = io("http://localhost:3000", {
        query: {
          userId: this.authService.loggedInUser()?._id
        }
      })
      this.socket.set(socket)

      // listen to server-side socket "online-users" event
      socket.on("online-users", users => {
        this.onlineUsers.set(users)
      })
    }
  }

  sendMessage(message: Message) {
    this.socket()?.emit("send-message", message)
  }

  getMessage() {
    const observable = new Observable<{ message: Message, conversation: Conversation }>(observer => {
      this.socket()?.on("get-message", message => {
        observer.next(message)
      })
      return () => { this.socket()?.disconnect() }
    })
    return observable
  }
}
