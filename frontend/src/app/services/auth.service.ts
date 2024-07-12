import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private requestOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')!)?.token}`
    })
  }
  private API: string = "http://localhost:3000"
  loggedInUser = signal<User | undefined>(this.localStorageUser() || undefined)

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(`${this.API}/auth`, this.requestOptions);
  }

  register(user: User) {
    return this.http.post(`${this.API}/auth/register`, user);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.API}/auth/login`, { email, password });
  }

  logout() {
    localStorage.removeItem("user")
    this.loggedInUser.set(undefined)
  }

  localStorageUser(): User {
    return JSON.parse(localStorage.getItem("user")!)?.user
  }
}
