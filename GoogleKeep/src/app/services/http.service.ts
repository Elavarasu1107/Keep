import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  snackMessageBox(message: any) {
    console.log(message);

    if (message.status === 401) {
      this.router.navigate(['/login']);
    }

    this.snackBar.open('Something went wrong!', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  post(endPoint: string, data: any, token: any): Observable<any> {
    return this.http
      .post('http://127.0.0.1:1337' + endPoint, data, {
        headers: { Authorization: token },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackMessageBox(error);
          return throwError(() => 'Something went wrong!');
        })
      );
  }

  get(endPoint: string, token: string): Observable<any> {
    return this.http
      .get('http://127.0.0.1:1337' + endPoint, {
        headers: { Authorization: token },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackMessageBox(error);

          return throwError(() => 'Something went wrong!');
        })
      );
  }

  update(endPoint: string, data: any, token: any): Observable<any> {
    return this.http
      .put('http://127.0.0.1:1337' + endPoint, data, {
        headers: { Authorization: token },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackMessageBox(error);
          return throwError(() => 'Something went wrong!');
        })
      );
  }

  delete(endPoint: string, token: any): Observable<any> {
    return this.http
      .delete('http://127.0.0.1:1337' + endPoint, {
        headers: { Authorization: token },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackMessageBox(error);
          return throwError(() => 'Something went wrong!');
        })
      );
  }
}
