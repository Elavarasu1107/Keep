import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  post(endPoint: string, data: any, headers: any): Observable<any> {
    return this.http.post(endPoint, data, headers).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackBar.open('Something went wrong!', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        return throwError(() => 'Something went wrong!');
      })
    );
  }

  get(endPoint: string, token: string): Observable<any> {
    return this.http.get(endPoint, { headers: { Authorization: token } }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackBar.open('Something went wrong!', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        return throwError(() => 'Something went wrong!');
      })
    );
  }
}
