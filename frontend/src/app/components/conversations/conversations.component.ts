import { Component, inject } from '@angular/core';
import { ConversationComponent } from "../conversation/conversation.component";
import { Conversation } from '../../interfaces/conversation';
import { SpinnerService } from '../../services/spinner.service';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [ConversationComponent, SpinnerComponent],
  templateUrl: './conversations.component.html',
})
export class ConversationsComponent {
  authService = inject(AuthService)
  chatService = inject(ChatService)
  spinnerService = inject(SpinnerService)

  getReceiverUser(userConversation: Conversation) {
    const loggedInUserId = this.authService.loggedInUser()?._id;
    return userConversation.members.find(member => member._id !== loggedInUserId)
  }

  getUnreadUserMessages(userConversation: Conversation) {
    const loggedInUserId = this.authService.loggedInUser()?._id;
    return userConversation.messages.filter(message => message.senderId !== loggedInUserId && !message.seen)
  }

}
