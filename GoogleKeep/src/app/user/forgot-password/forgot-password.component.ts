import { Component, DoCheck, OnInit, inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements DoCheck {
  showProgressBar!: boolean;
  constructor(
    private httpService: HttpService,
    private snackBar: SnackBarService,
    private router: Router
  ) {}

  ngDoCheck(): void {
    this.showProgressBar = this.httpService.requestStarted;
  }
  onSubmit(data: any) {
    this.httpService.requestStarted = true;
    this.httpService
      .post(environment.forgotPasswordUrl, data, '')
      .subscribe((resp) => {
        this.snackBar.setSnackBar(resp.message);
        this.httpService.requestStarted = false;
        this.router.navigate(['/login']);
      });
  }
}
