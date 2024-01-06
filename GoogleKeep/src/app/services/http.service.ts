import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  requestStarted: boolean = false;

  constructor(
    private http: HttpClient,
    private snackBar: SnackBarService,
    private router: Router
  ) {}

  snackMessageBox(message: any) {
    console.log(message);

    if (message.status === 401) {
      this.snackBar.setSnackBar('Unauthorized or session expired');
      this.router.navigate(['/login']);
      return;
    }

    this.snackBar.setSnackBar('Something went wrong!');
  }

  post(endPoint: string, data: any, token: any): Observable<any> {
    return this.http
      .post(environment.serverUrl + endPoint, data, {
        headers: { Authorization: token },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.requestStarted = false;
          this.snackMessageBox(error);
          return throwError(() => 'Something went wrong!');
        })
      );
  }

  get(endPoint: string, token: string): Observable<any> {
    return this.http
      .get(environment.serverUrl + endPoint, {
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
      .put(environment.serverUrl + endPoint, data, {
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
      .delete(environment.serverUrl + endPoint, {
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
