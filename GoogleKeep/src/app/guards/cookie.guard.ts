import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from '../services/cookie.service';

export const cookieGuard: CanActivateFn = (route, state) => {
  let isToken = inject(CookieService).checkToken();
  if (isToken) {
    return true;
  }
  inject(Router).navigate(['/login']);
  return false;
};
