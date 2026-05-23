import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService, Client } from '../../core/services/client.service';

@Component({
  selector: 'app-client-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="select-page">
      <div class="select-bg">
        <div class="bg-orb bg-orb-1"></div>
        <div class="bg-orb bg-orb-2"></div>
        <div class="bg-orb bg-orb-3"></div>
      </div>

      <div class="select-container">
        <div class="select-header">
          <div class="header-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#cg1)"/>
              <path d="M2 17l10 5 10-5" stroke="url(#cg1)" stroke-width="2" fill="none"/>
              <path d="M2 12l10 5 10-5" stroke="url(#cg1)" stroke-width="2" fill="none"/>
              <defs>
                <linearGradient id="cg1" x1="2" y1="2" x2="22" y2="22">
                  <stop stop-color="#3b82f6"/>
                  <stop offset="1" stop-color="#6366f1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>Select Client Site</h1>
          <p>Choose a site to manage its workforce and fleet</p>
        </div>

        <div class="clients-grid">
          <div class="client-card" *ngFor="let client of clients" (click)="onSelectClient(client)">
            <div class="client-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 21h18"/>
                <path d="M5 21V7l8-4v18"/>
                <path d="M19 21V11l-6-4"/>
                <path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/>
              </svg>
            </div>
            <h3>{{ client.name }}</h3>
            <span class="client-location" *ngIf="client.location">{{ client.location }}</span>
          </div>

          <!-- Add Client Card -->
          <div class="client-card add-card" (click)="showAddForm = !showAddForm" *ngIf="!showAddForm">
            <div class="add-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <h3>Add Client</h3>
            <span class="client-location">Register a new site</span>
          </div>
        </div>

        <!-- Add Client Form -->
        <div class="add-form-card" *ngIf="showAddForm">
          <h3>New Client Site</h3>
          <form (ngSubmit)="onAddClient()">
            <div class="form-row">
              <div class="form-group">
                <label for="clientName">Site Name *</label>
                <input id="clientName" class="form-control" [(ngModel)]="newClient.name" name="name"
                  placeholder="e.g. Ultratech Cement" required />
              </div>
              <div class="form-group">
                <label for="clientLocation">Location</label>
                <input id="clientLocation" class="form-control" [(ngModel)]="newClient.location" name="location"
                  placeholder="e.g. Jaipur, Rajasthan" />
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-ghost" (click)="showAddForm = false">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="!newClient.name.trim() || saving">
                {{ saving ? 'Creating...' : 'Create Client' }}
              </button>
            </div>
            <div class="error-msg" *ngIf="errorMessage">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .select-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: var(--bg-primary);
      padding: 40px 20px;
    }

    .select-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.25;
      animation: float 8s ease-in-out infinite;
    }

    .bg-orb-1 {
      width: 500px; height: 500px;
      background: #3b82f6;
      top: -150px; right: -150px;
    }

    .bg-orb-2 {
      width: 400px; height: 400px;
      background: #6366f1;
      bottom: -120px; left: -120px;
      animation-delay: 2s;
    }

    .bg-orb-3 {
      width: 250px; height: 250px;
      background: #10b981;
      top: 40%; left: 30%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-30px) scale(1.05); }
    }

    .select-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 720px;
    }

    .select-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .header-icon { margin-bottom: 16px; }

    .select-header h1 {
      font-size: 28px;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.03em;
      margin-bottom: 8px;
    }

    .select-header p {
      font-size: 14px;
      color: var(--text-muted);
    }

    .clients-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .client-card {
      background: rgba(17, 24, 39, 0.7);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 28px 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .client-card:hover {
      border-color: var(--accent-primary);
      background: rgba(59, 130, 246, 0.08);
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15);
    }

    .client-icon {
      margin-bottom: 14px;
      color: var(--accent-primary);
    }

    .client-card h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .client-location {
      font-size: 12px;
      color: var(--text-muted);
    }

    .add-card {
      border-style: dashed;
      border-color: var(--border-strong);
    }

    .add-card:hover {
      border-color: var(--accent-success);
      background: rgba(16, 185, 129, 0.06);
      box-shadow: 0 12px 40px rgba(16, 185, 129, 0.1);
    }

    .add-icon {
      margin-bottom: 14px;
      color: var(--text-muted);
      transition: color 0.2s ease;
    }

    .add-card:hover .add-icon {
      color: var(--accent-success);
    }

    .add-form-card {
      background: rgba(17, 24, 39, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      padding: 28px;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .add-form-card h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
      color: var(--text-primary);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 12px;
      color: var(--accent-danger);
      font-size: 13px;
    }

    @media (max-width: 540px) {
      .form-row { grid-template-columns: 1fr; }
      .clients-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ClientSelectComponent implements OnInit {
  clients: Client[] = [];
  showAddForm = false;
  saving = false;
  errorMessage = '';
  newClient: Client = { name: '', location: '' };

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAll().subscribe({
      next: (clients) => { this.clients = clients; },
      error: (err) => { console.error('Failed to load clients:', err); }
    });
  }

  onSelectClient(client: Client) {
    this.clientService.selectClient(client);
    this.router.navigate(['/workforce']);
  }

  onAddClient() {
    if (!this.newClient.name.trim()) return;
    this.saving = true;
    this.errorMessage = '';
    this.clientService.create(this.newClient).subscribe({
      next: () => {
        this.saving = false;
        this.showAddForm = false;
        this.newClient = { name: '', location: '' };
        this.loadClients();
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || err.message || 'Failed to create client. Check console.';
        console.error('Create client error:', err);
      }
    });
  }
}
