import { TitleCasePipe } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, Output } from '@angular/core';
import { User } from '../../interfaces/user';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './conversation.component.html',
})
export class ConversationComponent {
  chatService = inject(ChatService)
  authService = inject(AuthService)
  socketService = inject(SocketService)

  user = input<User>()

  @Output() searchCleared = new EventEmitter<void>()

  isOnline = computed(() => this.socketService.onlineUsers().includes(this.user()!._id ?? ""))


  onSelectUser() {
    // Clear search input
    this.searchCleared.emit()

    this.chatService.selectedUser.set(this.user())

    if (!this.user()?._id) return this.chatService.selectedUserMessages.set([])

    this.chatService.getMessages(this.user()!._id).subscribe({
      next: messages => {
        this.chatService.selectedUserMessages.set(messages)
      },
      error: err => {
        console.log(err);
      }
    })
  }

}
