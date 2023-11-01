import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  hide: boolean = true;

  constructor(private router: Router, private http: HttpService) {}

  loginSubmit(form: any) {
    this.http
      .post('/user/api/login/', form.value)
      .subscribe((resp: Observer<any>) => {
        this.router.navigate(['/notes']);
      });
  }
}
