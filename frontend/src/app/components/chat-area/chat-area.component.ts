import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Message } from '../../interfaces/message';
import { switchMap, tap } from 'rxjs';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [TitleCasePipe, DatePipe, NgClass, FormsModule],
  templateUrl: './chat-area.component.html',
})
export class ChatAreaComponent implements AfterViewChecked {
  chatService = inject(ChatService)
  authService = inject(AuthService)
  socketService = inject(SocketService)

  chatArea = viewChild<ElementRef>("chatArea")
  messageInput = signal("")


  constructor() {
    this.socketService.getMessage().subscribe({
      next: message => {
        this.chatService.selectedUserMessages().push(message)
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
    const receiverId = this.chatService.selectedUser()?._id
    if (!receiverId) return

    this.chatService.sendMessage(receiverId, this.messageInput()).subscribe({
      next: message => {
        this.chatService.selectedUserMessages.update(values => [...values, message])
      },
      error: err => {
        console.log(err);
      }
    })

  }

}
