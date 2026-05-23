import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../../core/services/employee.service';
import { ClientService } from '../../../core/services/client.service';
import { EmployeeProfileModalComponent } from '../employee-profile-modal/employee-profile-modal.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeProfileModalComponent],
  template: `
    <div class="container page-enter">
      <div class="page-header">
        <div>
          <h1 class="page-title">Workforce</h1>
          <p class="page-subtitle">Employee roster and management</p>
        </div>
        <button class="btn btn-primary" (click)="toggleAddForm()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Employee
        </button>
      </div>

      <!-- Add Employee Form -->
      <div class="add-form card" *ngIf="showAddForm">
        <div class="add-form-header">
          <h3>New Employee</h3>
          <button class="btn btn-ghost btn-sm" (click)="toggleAddForm()">Cancel</button>
        </div>
        <div class="add-form-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Name *</label>
              <input class="form-control" [(ngModel)]="newEmployee.name" placeholder="Full name" />
            </div>
            <div class="form-group">
              <label>Role</label>
              <select class="form-control" [(ngModel)]="newEmployee.role">
                <option value="">Select role</option>
                <option value="Operator">Operator</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Mechanic">Mechanic</option>
                <option value="Driver">Driver</option>
                <option value="Helper">Helper</option>
              </select>
            </div>
            <div class="form-group">
              <label>Hire Date</label>
              <input class="form-control" type="date" [(ngModel)]="newEmployee.hireDate" />
            </div>
            <div class="form-group">
              <label>Default Shift</label>
              <select class="form-control" [(ngModel)]="newEmployee.defaultShift">
                <option value="">Select shift</option>
                <option value="MORNING">Morning</option>
                <option value="NIGHT">Night</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input class="form-control" [(ngModel)]="newEmployee.phone" placeholder="Phone number" />
            </div>
            <div class="form-group">
              <label>PAN</label>
              <input class="form-control" [(ngModel)]="newEmployee.pan" placeholder="PAN number" />
            </div>
            <div class="form-group span-2">
              <label>Address</label>
              <input class="form-control" [(ngModel)]="newEmployee.address" placeholder="Full address" />
            </div>
            <div class="form-group span-2">
              <label>Photo URL</label>
              <input class="form-control" [(ngModel)]="newEmployee.photoUrl" placeholder="Profile photo link" />
            </div>
          </div>
          <div class="add-form-actions">
            <button class="btn btn-success" (click)="addEmployee()" [disabled]="!newEmployee.name">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Save Employee
            </button>
          </div>
        </div>
      </div>

      <!-- Employee Table -->
      <div class="card table-card">
        <div class="table-info">
          <span class="record-count">{{ employees.length }} employees</span>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Shift</th>
                <th>Phone</th>
                <th>Hire Date</th>
                <th>Paid Leave</th>
                <th>Sick Leave</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of employees">
                <td>
                  <div class="employee-cell">
                    <div class="avatar" [style.background]="getAvatarColor(emp.name)">
                      {{ getInitials(emp.name) }}
                    </div>
                    <span class="employee-name" (click)="openProfile(emp)">{{ emp.name }}</span>
                  </div>
                </td>
                <td>{{ emp.role || '\u2014' }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-morning': emp.defaultShift === 'MORNING',
                    'badge-night': emp.defaultShift === 'NIGHT',
                    'badge-present': emp.defaultShift === 'GENERAL'
                  }">{{ emp.defaultShift || '\u2014' }}</span>
                </td>
                <td>{{ emp.phone || '\u2014' }}</td>
                <td>{{ emp.hireDate | date:'mediumDate' }}</td>
                <td>
                  <span [class.text-danger]="(emp.paidLeaveBalance ?? 0) <= 2">{{ emp.paidLeaveBalance ?? 12 }}</span>
                </td>
                <td>
                  <span [class.text-danger]="(emp.sickLeaveBalance ?? 0) <= 0">{{ emp.sickLeaveBalance ?? 12 }}</span>
                </td>
              </tr>
              <tr *ngIf="employees.length === 0">
                <td colspan="7" class="empty-state">No employees found. Add your first employee above.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Profile Modal -->
      <app-employee-profile-modal
        *ngIf="selectedEmployee"
        [employee]="selectedEmployee"
        (close)="closeProfile()"
        (save)="saveEmployee($event)"
        (delete)="deleteEmployee($event)"
      ></app-employee-profile-modal>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32px 0 24px;
    }
    .page-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .page-subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .add-form {
      margin-bottom: 24px;
      overflow: hidden;
      animation: slideUp 0.3s ease;
    }
    .add-form-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
    }
    .add-form-header h3 {
      font-size: 15px;
      font-weight: 600;
    }
    .add-form-body {
      padding: 20px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .span-2 {
      grid-column: span 2;
    }
    .add-form-actions {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
    .table-card {
      overflow: hidden;
    }
    .table-info {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
    }
    .record-count {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .table-wrapper {
      overflow-x: auto;
    }
    .employee-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: white;
      flex-shrink: 0;
    }
    .employee-name {
      font-weight: 500;
      color: var(--accent-primary);
      cursor: pointer;
      transition: var(--transition);
    }
    .employee-name:hover {
      color: var(--text-primary);
      text-decoration: underline;
    }
    .text-danger {
      color: var(--accent-danger) !important;
      font-weight: 600;
    }
    .empty-state {
      text-align: center;
      padding: 40px !important;
      color: var(--text-muted);
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  showAddForm = false;
  selectedEmployee: Employee | null = null;
  newEmployee: Employee = this.getEmptyEmployee();

  private clientId: number | null = null;

  constructor(private employeeService: EmployeeService, private clientService: ClientService) {
    this.clientId = this.clientService.getSelectedClientId();
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAll(this.clientId!).subscribe(data => this.employees = data);
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.newEmployee = this.getEmptyEmployee();
    }
  }

  addEmployee() {
    if (!this.newEmployee.name) return;
    const payload = { ...this.newEmployee, clientId: this.clientId };
    this.employeeService.create(payload).subscribe({
      next: () => {
        this.loadEmployees();
        this.showAddForm = false;
      },
      error: (err) => {
        console.error('Create employee error:', err);
        alert(err.error?.message || 'Failed to create employee. Check console.');
      }
    });
  }

  openProfile(emp: Employee) {
    this.selectedEmployee = { ...emp };
  }

  closeProfile() {
    this.selectedEmployee = null;
  }

  saveEmployee(emp: Employee) {
    if (emp.id) {
      this.employeeService.update(emp.id, emp).subscribe(() => {
        this.loadEmployees();
        this.selectedEmployee = null;
      });
    }
  }

  deleteEmployee(emp: Employee) {
    if (emp.id) {
      this.employeeService.delete(emp.id).subscribe(() => {
        this.loadEmployees();
        this.selectedEmployee = null;
      });
    }
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

  private getEmptyEmployee(): Employee {
    return {
      name: '', role: '', hireDate: '', defaultShift: '',
      phone: '', address: '', pan: '', photoUrl: ''
    };
  }
}
