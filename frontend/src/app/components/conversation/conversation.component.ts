import { TitleCasePipe } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, Output } from '@angular/core';
import { User } from '../../interfaces/user';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { SpinnerComponent } from "../spinner/spinner.component";
import { SpinnerService } from '../../services/spinner.service';
import { Message } from '../../interfaces/message';
import { Conversation } from '../../interfaces/conversation';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [TitleCasePipe, SpinnerComponent],
  templateUrl: './conversation.component.html',
})
export class ConversationComponent {
  chatService = inject(ChatService)
  authService = inject(AuthService)
  socketService = inject(SocketService)
  spinnerService = inject(SpinnerService)

  user = input<User>()

  @Output() searchCleared = new EventEmitter<void>()
  conversation = input<Conversation>()
  unreadMessages = input<Message[]>()

  isOnline = computed(() => this.socketService.onlineUsers().includes(this.user()!._id ?? ""))

  onSelectUser() {
    // EMITS EVENT TO PARENT COMPONENT TO CLEAR SEARCH INPUT
    this.searchCleared.emit()
    // ON USER CLICK IT WILL SET SELECTED USER STATE OF CLICKED USER
    this.chatService.selectedUser.set(this.user())
    // IF SOMEHOW CLICKED USER DOES NOT EXISTS IT WILL SET THEIR MESSAGES AS EMPTY ARRAY
    if (!this.user()) return this.chatService.selectedUserMessages.set([])

    // MAKE API CALL TO GET MESSAGES FOR SELECTED USER
    this.spinnerService.showChatArea()
    this.chatService.getMessages(this.user()?._id!).subscribe({
      next: messages => {
        // THE MESSAGES RETURNED FROM SERVER ALREADY ARE MARKED AS SEEN, 
        this.chatService.selectedUserMessages.set(messages)
        // MARK STATE MESSAGES AS READ
        const conversation = this.chatService.userConversations().find(conv => conv._id === this.conversation()?._id);
        if (conversation) {
          conversation.messages.forEach(message => message.seen = true);
        }
      },
      complete: () => {
        this.spinnerService.hidechatArea()
      },
      error: err => {
        this.spinnerService.hidechatArea()
        console.log(err);
      }
    })
  }

}
