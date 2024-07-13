import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConversationComponent } from "../../components/conversation/conversation.component";
import { ChatAreaComponent } from "../../components/chat-area/chat-area.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { WelcomeComponent } from '../../components/welcome/welcome.component';
import { SocketService } from '../../services/socket.service';
import { MenuService } from '../../services/menu.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [DatePipe, TitleCasePipe, ConversationComponent, ChatAreaComponent, SidebarComponent, WelcomeComponent]
})
export class DashboardComponent {
  authService = inject(AuthService)
  chatService = inject(ChatService)
  socketService = inject(SocketService)
  menuService = inject(MenuService)

  constructor() {
    this.socketService.getOnlineUsers()
  }
}
