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
    const senderId = this.authService.loggedInUser()?._id
    if (!senderId || !receiverId) return

    const existingConversation = this.chatService.userConversations()
      .find(conversation => conversation.members.some(member => member._id === receiverId))

    if (!existingConversation) {
      this.chatService.createConversation(senderId, receiverId).pipe(
        tap(conversation => this.chatService.userConversations
          .update(values => [conversation, ...values])
        ),
        switchMap(conversation => {
          const message: Message = {
            conversationId: conversation._id,
            senderId: senderId,
            receiverId: receiverId,
            message: this.messageInput()
          }
          return this.chatService.sendMessage(message)
        })
      ).subscribe({
        next: res => {
          this.socketService.sendMessage(res)
          this.chatService.conversationsLastMessages.update(values => [...values, res])
        },
        error: err => { console.log(err); }
      })
    } else {
      const message: Message = {
        conversationId: existingConversation._id,
        senderId: senderId,
        receiverId: receiverId,
        message: this.messageInput()
      }
      this.chatService.sendMessage(message).subscribe({
        next: res => {
          this.chatService.selectedUserMessages.update(values => [...values, message])
          this.socketService.sendMessage(res)
          this.chatService.conversationsLastMessages.update(values => [...values, message])
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

}
