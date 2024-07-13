import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ConversationComponent } from "../conversation/conversation.component";
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { User } from '../../interfaces/user';
import { Conversation } from '../../interfaces/conversation';
import { SocketService } from '../../services/socket.service';
import { MenuService } from '../../services/menu.service';

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
  menuService = inject(MenuService)
  route = inject(Router)

  searchInput = ""
  searchedUsers = signal<User[]>([])

  ngOnInit(): void {
    this.chatService.getUserConversations().subscribe({
      next: conversations => {
        this.chatService.userConversations.set(conversations)
      },
      error: err => { console.log(err); }
    })

    this.socketService.getMessage().subscribe({
      next: ({ message, conversation }) => {
        const conversationExists = this.chatService.userConversations().find(conv => conv._id === conversation._id)
        if (!conversationExists) {
          this.chatService.userConversations.update(values => [conversation, ...values])
        }
      },
      error: err => {
        console.log(err.message);
      }
    })
  }

  onSearchCleared() {
    this.searchInput = ""
  }

  onSearchInputChange() {
    this.authService.getUsersByUsername(this.searchInput).subscribe({
      next: users => {
        this.searchedUsers.set(users)
      },
      error: err => {
        console.log(err.message);
      }
    })
  }

  onLogout() {
    this.authService.logout()
    this.socketService.socket()?.disconnect()
    this.route.navigateByUrl("login")
  }

  getReceiverUser(userConversation: Conversation) {
    const loggedInUserId = this.authService.loggedInUser()?._id;
    return userConversation.members.find(member => member._id !== loggedInUserId)
  }

  closeMenu() {
    this.menuService.isOpen.set(false)
  }

}
