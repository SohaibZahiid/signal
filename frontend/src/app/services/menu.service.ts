import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  isOpen = signal(false)

  constructor() { }
}
