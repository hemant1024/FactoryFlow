import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { ClientService } from './client.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private loggedIn = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private clientService: ClientService
  ) {
    this.loggedIn = localStorage.getItem('ff_auth') === 'true';
  }

  login(passcode: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { passcode }).pipe(
      map(res => res.success),
      tap(success => {
        if (success) {
          this.loggedIn = true;
          localStorage.setItem('ff_auth', 'true');
        }
      })
    );
  }

  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('ff_auth');
    this.clientService.clearClient();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
