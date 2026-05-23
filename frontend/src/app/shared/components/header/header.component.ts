import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ClientService } from '../../../core/services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <div class="header-inner">
        <div class="header-brand">
          <div class="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#g1)"/>
              <path d="M2 17l10 5 10-5" stroke="url(#g1)" stroke-width="2" fill="none"/>
              <path d="M2 12l10 5 10-5" stroke="url(#g1)" stroke-width="2" fill="none"/>
              <defs>
                <linearGradient id="g1" x1="2" y1="2" x2="22" y2="22">
                  <stop stop-color="#3b82f6"/>
                  <stop offset="1" stop-color="#6366f1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="brand-text">FactoryFlow</span>
          <span class="brand-divider">|</span>
          <button class="client-badge" (click)="switchSite()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/>
              <path d="M19 21V11l-6-4"/>
            </svg>
            {{ clientName }}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        <nav class="header-nav">
          <a routerLink="/workforce" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Workforce
          </a>
          <a routerLink="/workforce/attendance" routerLinkActive="active" class="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Attendance
          </a>
          <a routerLink="/fleet" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            Fleet
          </a>
          <a routerLink="/fleet/ledger" routerLinkActive="active" class="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Ledger
          </a>
        </nav>

        <button class="btn-logout" (click)="onLogout()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: rgba(10, 14, 23, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      z-index: 100;
    }

    .header-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-text {
      font-size: 18px;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.02em;
    }

    .brand-divider {
      color: var(--border-strong);
      font-weight: 300;
      font-size: 20px;
    }

    .client-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.25);
      border-radius: var(--radius-sm);
      color: var(--accent-primary);
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
    }

    .client-badge:hover {
      background: rgba(59, 130, 246, 0.18);
      border-color: var(--accent-primary);
    }

    .chevron { opacity: 0.6; }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      border-radius: var(--radius-sm);
      transition: var(--transition);
    }

    .nav-link:hover {
      color: var(--text-primary);
      background: var(--bg-glass-light);
    }

    .nav-link.active {
      color: var(--accent-primary);
      background: rgba(59, 130, 246, 0.1);
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: transparent;
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-logout:hover {
      color: var(--accent-danger);
      border-color: var(--accent-danger);
      background: var(--accent-danger-dim);
    }
  `]
})
export class HeaderComponent {
  clientName = '';

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private router: Router
  ) {
    this.clientName = this.clientService.getSelectedClientName();
  }

  switchSite() {
    this.clientService.clearClient();
    this.router.navigate(['/clients']);
  }

  onLogout() {
    this.authService.logout();
  }
}
