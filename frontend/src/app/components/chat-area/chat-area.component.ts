import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { MenuService } from '../../services/menu.service';
import { SpinnerService } from '../../services/spinner.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [TitleCasePipe, DatePipe, NgClass, FormsModule, SpinnerComponent],
  templateUrl: './chat-area.component.html',
})
export class ChatAreaComponent implements AfterViewChecked {
  chatService = inject(ChatService)
  authService = inject(AuthService)
  socketService = inject(SocketService)
  spinnerService = inject(SpinnerService)
  menuService = inject(MenuService)

  chatArea = viewChild<ElementRef>("chatArea")
  messageInput = signal("")


  constructor() {
    this.socketService.getMessage().subscribe({
      next: ({ message, conversation }) => {
        const currentSelectedUser = this.chatService.selectedUser();
        // Ensure message belongs to current chat
        if (currentSelectedUser && conversation.members.some(member => member._id === currentSelectedUser._id)) {
          this.chatService.selectedUserMessages.update(values => [...values, message]);
        }
      },
      error: err => {
        console.log(err);
      }
    })
  }

  ngAfterViewChecked(): void {
    if (this.chatArea()) {
      this.chatArea()!.nativeElement.scrollTop = this.chatArea()!.nativeElement.scrollHeight;
    }
  }

  onSendMessage() {
    const senderId = this.authService.loggedInUser()?._id
    const receiverId = this.chatService.selectedUser()?._id
    if (!senderId || !receiverId) return

    this.spinnerService.showSending()
    this.chatService.sendMessage(receiverId, this.messageInput()).subscribe({
      next: ({ message, conversation }) => {
        this.chatService.selectedUserMessages.update(values => [...values, message])
        this.socketService.sendMessage(message)

        const conversationExists = this.chatService.userConversations().find(conv => conv._id === conversation._id)
        if (!conversationExists) {
          this.chatService.userConversations.update(values => [conversation, ...values])
        }
        this.messageInput.set("")
      },
      complete: () => {
        this.spinnerService.hideSending()
      },
      error: err => {
        this.spinnerService.hideSending()
        console.log(err);
      }
    })

  }

  openMenu() {
    this.menuService.isOpen.set(true)
  }

}
