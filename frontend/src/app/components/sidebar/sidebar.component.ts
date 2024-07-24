import { Component, inject, OnInit } from '@angular/core';
import { ConversationComponent } from "../conversation/conversation.component";

import { ChatService } from '../../services/chat.service';

import { SocketService } from '../../services/socket.service';
import { MenuService } from '../../services/menu.service';
import { SpinnerComponent } from "../spinner/spinner.component";
import { SpinnerService } from '../../services/spinner.service';
import { TopbarComponent } from "../topbar/topbar.component";
import { SearchComponent } from "../search/search.component";
import { ConversationsComponent } from "../conversations/conversations.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [ConversationComponent, SpinnerComponent, TopbarComponent, SearchComponent, ConversationsComponent]
})
export class SidebarComponent implements OnInit {
  chatService = inject(ChatService)
  socketService = inject(SocketService)
  menuService = inject(MenuService)
  spinnerService = inject(SpinnerService)

  ngOnInit(): void {
    this.getUserConversations()
    this.getIncomingMessage()
  }

  getIncomingMessage() {
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

  getUserConversations() {
    this.spinnerService.showSidebar()
    this.chatService.getUserConversations().subscribe({
      next: conversations => {
        this.chatService.userConversations.set(conversations)
      },
      complete: () => {
        this.spinnerService.hideSidebar()
      },
      error: err => {
        console.log(err);
        this.spinnerService.hideSidebar()
      }
    })
  }

  closeMenu() {
    this.menuService.isOpen.set(false)
  }

}
