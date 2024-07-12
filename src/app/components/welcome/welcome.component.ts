import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  authService = inject(AuthService)
}
