import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API: string = "http://localhost:3000"
  loggedInUser = signal<User | undefined>(this.localStorageUser() || undefined)

  constructor(private http: HttpClient) {
  }

  logout() {
    localStorage.removeItem("user")
    this.loggedInUser.set(undefined)
  }

  register(user: User) {
    return this.http.post(`${this.API}/auth/register`, user);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.API}/auth/login`, { email, password });
  }

  localStorageUser(): User {
    return JSON.parse(localStorage.getItem("user")!)?.user
  }
}
