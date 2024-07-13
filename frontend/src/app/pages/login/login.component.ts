import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup
  isFormSubmitted = false
  errorMessage = ""

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private route: Router) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    })
  }

  onSubmit() {
    const isFromValid = this.loginForm.valid
    if (!isFromValid) return this.loginForm.markAllAsTouched()

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (res: any) => {
        localStorage.setItem("user", JSON.stringify(res))
        this.authService.loggedInUser.set(res.user)
        this.route.navigateByUrl("/dashboard")
      },
      error: err => {
        this.errorMessage = err.error
      }
    })
  }
}
