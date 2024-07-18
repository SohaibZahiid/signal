import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isFormSubmitted = false
  errorMessage = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router) {
    this.registerForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(4)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]],
      image: [null, [Validators.required,]]
    })
  }

  onSubmit() {

    const formData = new FormData()
    formData.append("username", this.registerForm.get("username")?.value)
    formData.append("email", this.registerForm.get("email")?.value)
    formData.append("password", this.registerForm.get("password")?.value)
    formData.append("image", this.registerForm.get("image")?.value)

    const isFormValid = this.registerForm.valid
    if (!isFormValid) return this.registerForm.markAllAsTouched()
    this.authService.register(formData).subscribe({
      next: (res) => {
        this.route.navigate(["/login"])
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.error
      }
    })
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0]
      this.registerForm.patchValue({
        image: file
      })
    }
  }

}
