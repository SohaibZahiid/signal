import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConversationComponent } from "../../components/conversation/conversation.component";
import { ChatAreaComponent } from "../../components/chat-area/chat-area.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { SocketService } from '../../services/socket.service';
import { MenuService } from '../../services/menu.service';
import { SpinnerComponent } from "../../components/spinner/spinner.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [DatePipe, TitleCasePipe, ConversationComponent, ChatAreaComponent, SidebarComponent, SpinnerComponent]
})
export class DashboardComponent {
  socketService = inject(SocketService)
  menuService = inject(MenuService)

  constructor() {
    this.socketService.getOnlineUsers()
  }
}
