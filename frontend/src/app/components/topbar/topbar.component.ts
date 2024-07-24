import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TitleCasePipe } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  authService = inject(AuthService)
  socketService = inject(SocketService)
  route = inject(Router)

  onLogout() {
    this.authService.logout()
    this.socketService.socket()?.disconnect()
    this.route.navigateByUrl("login")
  }
}
