import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { ConversationComponent } from "../conversation/conversation.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, ConversationComponent],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  authService = inject(AuthService)
  spinnerService = inject(SpinnerService)

  searchInput = ""
  searchedUsers = signal<User[]>([])

  onSearchCleared() {
    this.searchInput = ""
  }

  onSearchInputChange() {
    this.spinnerService.showSearching()
    this.authService.getUsersByUsername(this.searchInput).subscribe({
      next: users => {
        this.searchedUsers.set(users)
      },
      complete: () => {
        this.spinnerService.hideSearching()
      },
      error: err => {
        this.spinnerService.hideSearching()
        console.log(err.message);
      }
    })
  }
}
