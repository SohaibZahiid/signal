import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  isLoading = signal(false)

  sidebarIsLoading = signal(false)
  chatAreaIsLoading = signal(false)
  isSendingMessage = signal(false)
  isSearching = signal(false)

  constructor() { }

  hide() {
    this.isLoading.set(false)
  }

  show() {
    this.isLoading.set(true)
  }

  hideSidebar() {
    this.sidebarIsLoading.set(false)
  }

  showSidebar() {
    this.sidebarIsLoading.set(true)
  }

  hidechatArea() {
    this.chatAreaIsLoading.set(false)
  }

  showChatArea() {
    this.chatAreaIsLoading.set(true)
  }

  hideSending() {
    this.isSendingMessage.set(false)
  }

  showSending() {
    this.isSendingMessage.set(true)
  }

  hideSearching() {
    this.isSearching.set(false)
  }

  showSearching() {
    this.isSearching.set(true)
  }
}
