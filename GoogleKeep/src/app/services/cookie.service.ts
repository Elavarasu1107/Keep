import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService as CS } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor(private cookie: CS, private router: Router) {}

  setToken(token: string) {
    this.cookie.set('Auth-Token', token, 0.0417);
  }

  getToken(): any {
    if (!this.checkToken()) {
      this.router.navigate(['/login']);
    }
    return this.cookie.get('Auth-Token');
  }

  checkToken() {
    return this.cookie.check('Auth-Token');
  }

  deleteToken() {
    this.cookie.delete('Auth-Token');
  }
}
