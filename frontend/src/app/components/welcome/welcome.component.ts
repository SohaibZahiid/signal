import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TitleCasePipe } from '@angular/common';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  authService = inject(AuthService)
  menuService = inject(MenuService)

  openMenu() {
    this.menuService.isOpen.set(true)
  }
}
