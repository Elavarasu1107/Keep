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

  post(endPoint: string, data: any, headers: any): Observable<any> {
    return this.http.post(endPoint, data, headers).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackMessageBox(error);
        return throwError(() => 'Something went wrong!');
      })
    );
  }

  get(endPoint: string, token: string): Observable<any> {
    return this.http.get(endPoint, { headers: { Authorization: token } }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackMessageBox(error);

        return throwError(() => 'Something went wrong!');
      })
    );
  }

  update(endPoint: string, data: any, headers: any): Observable<any> {
    return this.http.put(endPoint, data, headers).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackMessageBox(error);
        return throwError(() => 'Something went wrong!');
      })
    );
  }

  delete(endPoint: string, headers: any): Observable<any> {
    return this.http.delete(endPoint, headers).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackMessageBox(error);
        return throwError(() => 'Something went wrong!');
      })
    );
  }
}
