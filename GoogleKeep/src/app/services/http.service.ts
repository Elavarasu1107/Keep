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

  post(endPoint: string, data: any): Observable<any> {
    return this.http.post(endPoint, data).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackBar.open(JSON.stringify(error.error['message']), 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        return throwError(() => null);
      })
    );
  }
}
