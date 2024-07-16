import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API: string = environment.apiUrl
  private requestOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')!)?.token}`,
    })
  }

  loggedInUser = signal<User | undefined>(this.localStorageUser() || undefined)

  constructor(private http: HttpClient) { }

  getUsersByUsername(username: string) {
    return this.http.get<User[]>(`${this.API}/auth/users?username=${username}`, this.requestOptions);
  }

  register(user: any) {
    return this.http.post<User>(`${this.API}/auth/register`, user);
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
