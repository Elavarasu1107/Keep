import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}

  setLoginUser(data: any) {
    sessionStorage.setItem('user', data);
  }

  getLoggedUser() {
    return sessionStorage.getItem('user');
  }

  clearLoggedUser() {
    sessionStorage.removeItem('user');
  }
}
