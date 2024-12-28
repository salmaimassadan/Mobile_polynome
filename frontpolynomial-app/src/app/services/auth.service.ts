import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError, tap } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/public'; // Update with your backend URL

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }),
      catchError(error => {
        this.snackBar.open('Login failed. Please check your credentials.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  register(registerData: { username: string, password: string, email: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData).pipe(
      tap(response => {
        this.snackBar.open('Registration successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }),
      catchError(error => {
        this.snackBar.open('Registration failed. User already exists.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return throwError(() => new Error('Registration failed'));
      })
    );
  }
  changePassword(changePasswordData: { email: string, password: string, newPassword: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/changePassword`, changePasswordData).pipe(
      tap(response => {
        this.snackBar.open(response.message, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }),
      catchError(error => {
        this.snackBar.open(error.error.error || 'Password change failed. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return throwError(() => new Error(error.error.error || 'Password change failed'));
      })
    );
  }
}