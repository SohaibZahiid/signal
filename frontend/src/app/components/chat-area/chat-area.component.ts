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

  ngOnInit(): void {
    this.getIncomingMessage()
  }

  getIncomingMessage() {
    // GET MESSAGE IN REALTIME USING SOCKET, IT WILL RETURN MESSAGE AND CONVERSATION TO SHOW MESSAGE TO ONLY SPECIFIC USER
    this.socketService.getMessage().subscribe({
      next: ({ message, conversation }) => {
        // UPDATE THE CURRENT SELECTED USER SO IT SHOWS MESSAGES OF THAT USER IN CHAT AREA COMPONENT
        const currentSelectedUser = this.chatService.selectedUser();
        // CHECK IF USER OPENED CHAT OF THE USER THAT HAS SEND NEW MESSAGE, IF SO DON'T SHOW NOTIFICATIONS ELSE SHOW
        if (currentSelectedUser && currentSelectedUser._id === message.senderId) {
          // IF OPENED CHAT, THEN MARK ALL MESSAGES AS SEEN, AND UPDATE GLOBAL STATE OF SELECTED USER MESSAGES
          this.chatService.markUserMessagesAsRead()
          // ALSO MARK NEWLY MESSAGE SENT AS SEEN TOO
          message.seen = true
          this.chatService.playIncomingMessage(true)
        } else {
          this.chatService.playIncomingMessage()
          this.chatService.selectedUserMessages.update(messages => [...messages, message])
          this.chatService.userConversations().find(conv => conv._id === conversation._id)!.messages.push(message)
        }
        // CHECK IF USER OPENED CHAT OF THE USER THAT HAS SEND NEW MESSAGE, IF SO DON'T SHOW NOTIFICATIONS ELSE SHOW
        if (currentSelectedUser && currentSelectedUser._id === message.senderId) {
          // IF OPENED CHAT, THEN MARK ALL MESSAGES AS SEEN, AND UPDATE GLOBAL STATE OF SELECTED USER MESSAGES
          const messagesMarkedAsSeen = this.chatService.selectedUserMessages().map(msg => ({ ...msg, seen: true }))
          this.chatService.selectedUserMessages.set(messagesMarkedAsSeen)
          // ALSO MARK NEWLY MESSAGE SENT AS SEEN TOO
          message.seen = true
          this.chatService.playIncomingMessage(true)
        } else {
          this.chatService.playIncomingMessage()
          this.chatService.unreadUserMessages.update((values) => [...values, message])
        }
        // ENSURE WHEN MESSAGE SENT... NOT TO SHOW ALL USERS, ONLY TO SPECIFIC USER THAT HAVE BEEN SENT
        if (currentSelectedUser && conversation.members.some(member => member._id === currentSelectedUser._id)) {
          this.chatService.selectedUserMessages.update(values => [...values, message]);
        }
        // UPDATE USER CONVERSATIONS STATE, FIND USER CONVERSATION FIRST THEN UPDATE THEIR LAST MESSAGE TO THE MESSAGE THAT HAS BEEN SENT
        const conversationExists = this.chatService.userConversations().find(conv => conv._id === conversation._id)
        if (conversationExists) {
          conversationExists.lastMessage = message
        }
      },
      error: err => {
        console.log(err);
      }
    })
  }

  ngAfterViewChecked(): void {
    // AUTOMATICALLY SCROLLS TO THE LAST MESSAGE SO USER DON'T HAVE TO MANUALLY SCROLL DOWN
    if (this.chatArea()) {
      this.chatArea()!.nativeElement.scrollTop = this.chatArea()!.nativeElement.scrollHeight;
    }
  }

  onSendMessage() {
    if (!this.messageInput()) return

    // CHECK IF SENDER OR RECEIVER ID DOES NOT EXISTS RETURN AS WE CAN'T SEND MESSAGE IF WE DONT HAVE USERS ID'S
    const senderId = this.authService.loggedInUser()?._id
    const receiverId = this.chatService.selectedUser()?._id
    if (!senderId || !receiverId) return



    // SEND USER MESSAGE TO SERVER AND STORE IT IN DATABASE
    this.spinnerService.showSending()
    this.chatService.sendMessage(receiverId, this.messageInput()).subscribe({
      next: ({ message, conversation }) => {
        // AFTER MESSAGE STORED IN DB API RETURNS MESSAGE AND CONVERSATION OBJECT,
        // ADD MESSAGE THAT HAS BEEN SENT IN THE SELECTED USER MESSAGES ARRAY TO SHOW IN REALTIME
        this.chatService.selectedUserMessages.update(values => [...values, message])
        // SEND SOCKET EVENT TO SERVER ABOUT NEW MESSAGE
        this.socketService.sendMessage(message)
        // CHECK IF USER ALREADY HAS CONVERSATION WITH THE USER THAT HE SENT MESSAGE
        const conversationExists = this.chatService.userConversations().find(conv => conv._id === conversation._id)
        if (!conversationExists) {
          // IF USER DOES NOT HAVE CONVERSATION THEN CREATE NEW CONVERSATION (SHOW USER ON SIDEBAR)
          this.chatService.userConversations.update(values => [conversation, ...values])
        }
        // UPDATE USER CONVERSATIONS STATE, FIND USER CONVERSATION FIRST THEN UPDATE THEIR LAST MESSAGE TO THE MESSAGE THAT HAS BEEN SENT
        if (conversationExists) {
          conversationExists.lastMessage = message
        }
        // CLEAR MESSAGE INPUT
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
