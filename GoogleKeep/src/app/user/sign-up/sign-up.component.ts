import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  registerForm!: FormGroup;
  hide: boolean = true;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      location: new FormControl(''),
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get firstName() {
    return this.registerForm.get('first_name');
  }

  get lastName() {
    return this.registerForm.get('last_name');
  }

  get mobile() {
    return this.registerForm.get('mobile');
  }

  get location() {
    return this.registerForm.get('location');
  }

  getErrors(arg: any): [boolean, string] {
    let error = arg['errors'];

    if (error !== null) {
      if (error['required']) {
        return [true, 'Field required!'];
      } else if (error['email']) {
        return [true, 'Invalid Email!'];
      } else if (arg.invalid) {
        return [true, 'Invalid Input!'];
      }
    }
    return [false, ''];
  }

  registerUser() {
    this.http
      .post('/user/api/registration/', this.registerForm.value)
      .subscribe((resp: any) => {
        if (resp.status === 201) {
          this.registerForm.reset();
          Object.keys(this.registerForm.controls).forEach((key) => {
            this.registerForm.get(key)?.setErrors(null);
            this.registerForm.get(key)?.markAsUntouched();

            this.router.navigate(['/login']);
          });
        }
        this.snackBar.open(resp['message'], 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
  }
}
