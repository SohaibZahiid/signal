import { Component, inject, OnInit, signal } from '@angular/core';
import { ConversationComponent } from "../conversation/conversation.component";
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { User } from '../../interfaces/user';
import { Conversation } from '../../interfaces/conversation';
import { Message } from '../../interfaces/message';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [ConversationComponent, TitleCasePipe, FormsModule]
})
export class SidebarComponent implements OnInit {
  authService = inject(AuthService)
  chatService = inject(ChatService)
  socketService = inject(SocketService)
  route = inject(Router)

  searchInput = ""
  searchedUsers = signal<User[]>([])

  selectedUserMessages = signal<Message[]>([])


  ngOnInit(): void {
    const userId = this.authService.loggedInUser()?._id
    if (!userId) return

    this.chatService.getConversations(userId).subscribe({
      next: res => {
        this.chatService.userConversations.set(res)
      },
      error: err => { console.log(err); }
    })

    this.chatService.getUsersLastMessages().subscribe({
      next: res => {
        this.chatService.conversationsLastMessages.set(res)
      },
      error: err => {
        console.log(err);
      }
    })
  }

  onSearchCleared() {
    this.searchInput = ""
  }

  onSearchInputChange() {
    this.chatService.getUsersByUsername(this.searchInput).subscribe({
      next: res => {
        this.searchedUsers.set(res)
      },
      error: err => {
        console.log(err);
        this.searchedUsers.set([])
      }
    })
  }

  onLogout() {
    this.authService.logout()
    this.socketService.socket()?.disconnect()
    this.route.navigateByUrl("login")
  }

  getFriendId(userConversation: Conversation) {
    const loggedInUserId = this.authService.loggedInUser()?._id;
    return userConversation.members.find(member => member._id !== loggedInUserId)
  }

}
