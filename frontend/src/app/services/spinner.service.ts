import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  isLoading = signal(false)

  constructor() { }

  hide() {
    this.isLoading.set(false)
  }

  show() {
    this.isLoading.set(true)
  }
}
