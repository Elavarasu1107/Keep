import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observer, Subscription } from 'rxjs';
import { CookieService } from '../../services/cookie.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnDestroy {
  hide: boolean = true;
  subscription = new Subscription();
  constructor(
    private router: Router,
    private http: HttpService,
    private cookie: CookieService
  ) {}

  loginSubmit(form: any) {
    this.subscription.add(
      this.http.post('/api/user/login/', form.value, '').subscribe(
        (resp) => {
          if (resp.status === 200) {
            this.cookie.setToken(resp.data.access);
            this.router.navigate(['/notes']);
          }
        },
        (error) => {}
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
