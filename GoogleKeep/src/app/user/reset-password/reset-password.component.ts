import { Component, DoCheck, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, DoCheck {
  resetPasswordForm!: FormGroup;
  showProgressBar!: boolean;
  token!: string | null;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    console.log(this.activeRoute.snapshot.queryParamMap.get('token'));
    this.token = this.activeRoute.snapshot.queryParamMap.get('token');
    if (this.token === null || this.token === undefined) {
      this.snackBar.setSnackBar('Token required');
      this.router.navigate(['/login']);
    }

    this.resetPasswordForm = this.fb.group({
      new_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  get password() {
    return this.resetPasswordForm.get('new_password');
  }

  get confirm_password() {
    return this.resetPasswordForm.get('confirm_password');
  }

  ngDoCheck(): void {
    this.showProgressBar = this.httpService.requestStarted;
  }

  onSubmit() {
    this.httpService.requestStarted = true;
    this.httpService
      .post(
        environment.resetPasswordUrl + `?token=${this.token}`,
        this.resetPasswordForm.value,
        ''
      )
      .subscribe((resp) => {
        this.snackBar.setSnackBar(resp.message);
        this.httpService.requestStarted = false;
        this.router.navigate(['/login']);
      });
  }
}
