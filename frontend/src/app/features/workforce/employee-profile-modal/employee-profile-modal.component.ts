import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeService } from '../../../core/services/employee.service';
import { ClientService, Client } from '../../../core/services/client.service';

@Component({
  selector: 'app-employee-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onBackdropClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Employee Profile</h2>
          <button class="btn btn-ghost btn-icon" (click)="close.emit()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="profile-header-section">
            <div class="profile-avatar" [style.background]="getAvatarColor(employee.name)">
              {{ getInitials(employee.name) }}
            </div>
            <div class="profile-meta">
              <div class="leave-badges">
                <span class="leave-badge paid">
                  <strong>{{ employee.paidLeaveBalance ?? 12 }}</strong> Paid Leave
                </span>
                <span class="leave-badge sick" [class.negative]="(employee.sickLeaveBalance ?? 12) < 0">
                  <strong>{{ employee.sickLeaveBalance ?? 12 }}</strong> Sick Leave
                </span>
              </div>
            </div>
          </div>

          <div class="profile-form">
            <div class="form-section">
              <h4>Personal Information</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Name</label>
                  <input class="form-control" [(ngModel)]="employee.name" />
                </div>
                <div class="form-group">
                  <label>Phone</label>
                  <input class="form-control" [(ngModel)]="employee.phone" />
                </div>
                <div class="form-group">
                  <label>PAN</label>
                  <input class="form-control" [(ngModel)]="employee.pan" />
                </div>
                <div class="form-group">
                  <label>Photo URL</label>
                  <input class="form-control" [(ngModel)]="employee.photoUrl" />
                </div>
                <div class="form-group span-2">
                  <label>Address</label>
                  <input class="form-control" [(ngModel)]="employee.address" />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>Work Details</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Role</label>
                  <select class="form-control" [(ngModel)]="employee.role">
                    <option value="Operator">Operator</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Mechanic">Mechanic</option>
                    <option value="Driver">Driver</option>
                    <option value="Helper">Helper</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Default Shift</label>
                  <select class="form-control" [(ngModel)]="employee.defaultShift">
                    <option value="MORNING">Morning</option>
                    <option value="NIGHT">Night</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Hire Date</label>
                  <input class="form-control" type="date" [(ngModel)]="employee.hireDate" />
                </div>
              </div>
            </div>

            <!-- Transfer Site Section -->
            <div class="form-section" *ngIf="clients.length > 0">
              <h4>Transfer Site</h4>
              <div class="transfer-row">
                <div class="current-site">
                  <span class="site-label">Current:</span>
                  <span class="site-value">{{ employee.client?.name || 'Unassigned' }}</span>
                </div>
                <div class="transfer-controls">
                  <select class="form-control" [(ngModel)]="transferClientId">
                    <option [ngValue]="null">&mdash; Select destination &mdash;</option>
                    <option *ngFor="let c of clients" [ngValue]="c.id"
                      [disabled]="c.id === employee.client?.id">
                      {{ c.name }}
                    </option>
                  </select>
                  <button class="btn btn-warning btn-sm" (click)="onTransfer()"
                    [disabled]="!transferClientId || transferring">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="15 3 21 3 21 9"/><path d="M21 3l-7 7"/>
                      <polyline points="9 21 3 21 3 15"/><path d="M3 21l7-7"/>
                    </svg>
                    {{ transferring ? 'Transferring...' : 'Transfer' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-danger" (click)="onDelete()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Delete Employee
          </button>
          <div class="footer-actions">
            <button class="btn btn-ghost" (click)="close.emit()">Cancel</button>
            <button class="btn btn-primary" (click)="save.emit(employee)">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-header-section {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }
    .profile-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }
    .leave-badges {
      display: flex;
      gap: 10px;
    }
    .leave-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 500;
    }
    .leave-badge.paid {
      background: var(--accent-success-dim);
      color: var(--accent-success);
    }
    .leave-badge.sick {
      background: var(--accent-warning-dim);
      color: var(--accent-warning);
    }
    .leave-badge.negative {
      background: var(--accent-danger-dim);
      color: var(--accent-danger);
    }
    .leave-badge strong {
      font-weight: 700;
      font-size: 14px;
    }
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .form-section h4 {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 12px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .span-2 {
      grid-column: span 2;
    }
    .footer-actions {
      display: flex;
      gap: 8px;
    }
    .transfer-row {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .current-site {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }
    .site-label {
      color: var(--text-muted);
      font-weight: 500;
    }
    .site-value {
      color: var(--accent-primary);
      font-weight: 600;
    }
    .transfer-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .transfer-controls select {
      flex: 1;
    }
    .btn-warning {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: var(--radius-sm);
      color: var(--accent-warning);
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      white-space: nowrap;
    }
    .btn-warning:hover:not(:disabled) {
      background: rgba(245, 158, 11, 0.25);
      border-color: var(--accent-warning);
    }
    .btn-warning:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class EmployeeProfileModalComponent implements OnInit {
  @Input() employee!: Employee;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Employee>();
  @Output() delete = new EventEmitter<Employee>();

  clients: Client[] = [];
  transferClientId: number | null = null;
  transferring = false;

  constructor(
    private clientService: ClientService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.clientService.getAll().subscribe(clients => {
      this.clients = clients;
    });
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  onDelete() {
    if (confirm('Are you sure you want to permanently delete this employee? This action cannot be undone.')) {
      this.delete.emit(this.employee);
    }
  }

  onTransfer() {
    if (!this.transferClientId || !this.employee.id) return;
    this.transferring = true;
    this.employeeService.transfer(this.employee.id, this.transferClientId).subscribe({
      next: () => {
        this.transferring = false;
        this.close.emit();
      },
      error: () => {
        this.transferring = false;
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }
}
