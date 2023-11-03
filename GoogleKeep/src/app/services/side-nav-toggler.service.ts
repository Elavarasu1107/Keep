import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SideNavTogglerService {
  toggleNavBar: boolean = false;

  toggleBoolean() {
    this.toggleNavBar = !this.toggleNavBar;
  }

  getBooleanValue() {
    return this.toggleNavBar;
  }
}
