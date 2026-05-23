import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-bg">
        <div class="bg-orb bg-orb-1"></div>
        <div class="bg-orb bg-orb-2"></div>
        <div class="bg-orb bg-orb-3"></div>
      </div>

      <div class="login-card" [class.shake]="shakeError">
        <div class="login-header">
          <div class="login-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#lg1)"/>
              <path d="M2 17l10 5 10-5" stroke="url(#lg1)" stroke-width="2" fill="none"/>
              <path d="M2 12l10 5 10-5" stroke="url(#lg1)" stroke-width="2" fill="none"/>
              <defs>
                <linearGradient id="lg1" x1="2" y1="2" x2="22" y2="22">
                  <stop stop-color="#3b82f6"/>
                  <stop offset="1" stop-color="#6366f1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>FactoryFlow</h1>
          <p>Fleet & Workforce Management</p>
        </div>

        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="passcode">ACCESS CODE</label>
            <input
              id="passcode"
              type="password"
              class="form-control login-input"
              [(ngModel)]="passcode"
              name="passcode"
              placeholder="Enter passcode"
              autocomplete="off"
              [disabled]="loading"
            />
          </div>

          <div class="error-msg" *ngIf="errorMessage">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-primary login-btn" [disabled]="loading">
            <span *ngIf="!loading">Authenticate</span>
            <span *ngIf="loading" class="spinner"></span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: var(--bg-primary);
    }

    .login-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      animation: float 8s ease-in-out infinite;
    }

    .bg-orb-1 {
      width: 400px;
      height: 400px;
      background: #3b82f6;
      top: -100px;
      right: -100px;
      animation-delay: 0s;
    }

    .bg-orb-2 {
      width: 300px;
      height: 300px;
      background: #6366f1;
      bottom: -80px;
      left: -80px;
      animation-delay: 2s;
    }

    .bg-orb-3 {
      width: 200px;
      height: 200px;
      background: #10b981;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-30px) scale(1.05); }
    }

    .login-card {
      position: relative;
      width: 400px;
      padding: 40px;
      background: rgba(17, 24, 39, 0.8);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: 1;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-icon {
      margin-bottom: 16px;
    }

    .login-header h1 {
      font-size: 28px;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.03em;
      margin-bottom: 4px;
    }

    .login-header p {
      font-size: 13px;
      color: var(--text-muted);
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .login-input {
      text-align: center;
      font-size: 16px;
      letter-spacing: 0.15em;
      padding: 14px;
    }

    .login-btn {
      width: 100%;
      padding: 14px;
      font-size: 14px;
      font-weight: 600;
    }

    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-msg {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      color: var(--accent-danger);
      font-size: 13px;
      animation: fadeIn 0.2s ease;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      display: inline-block;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
  passcode = '';
  loading = false;
  errorMessage = '';
  shakeError = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/clients']);
    }
  }

  onLogin() {
    if (!this.passcode.trim()) {
      this.showError('Please enter the passcode');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.passcode).subscribe({
      next: (success) => {
        this.loading = false;
        if (success) {
          this.router.navigate(['/clients']);
        } else {
          this.showError('Invalid passcode');
        }
      },
      error: () => {
        this.loading = false;
        this.showError('Invalid passcode');
      }
    });
  }

  private showError(msg: string) {
    this.errorMessage = msg;
    this.shakeError = true;
    setTimeout(() => this.shakeError = false, 300);
  }
}
