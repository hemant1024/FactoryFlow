import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService, Attendance } from '../../../core/services/attendance.service';
import { EmployeeService, Employee } from '../../../core/services/employee.service';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-attendance-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-enter">
      <div class="page-header">
        <div>
          <h1 class="page-title">Attendance Tracker</h1>
          <p class="page-subtitle">Daily attendance marking and leave management</p>
        </div>
      </div>

      <!-- Date Selector -->
      <div class="card date-selector">
        <div class="date-controls">
          <button class="btn btn-ghost btn-sm" (click)="changeDate(-1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div class="date-display">
            <input type="date" class="form-control date-input" [(ngModel)]="selectedDate" (change)="onDateChange()" />
            <span class="day-label" [class.sunday]="isSunday()">{{ getDayName() }}</span>
          </div>
          <button class="btn btn-ghost btn-sm" (click)="changeDate(1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
        <div class="date-stats" *ngIf="employees.length > 0">
          <span class="stat present">{{ getPresentCount() }} Present</span>
          <span class="stat absent">{{ getAbsentCount() }} Absent</span>
          <span class="stat unmarked">{{ getUnmarkedCount() }} Unmarked</span>
        </div>
      </div>

      <!-- Sunday Notice -->
      <div class="sunday-notice" *ngIf="isSunday()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Sunday &mdash; No leave deductions will be applied
      </div>

      <!-- Attendance Table -->
      <div class="card table-card">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 60px">#</th>
                <th>Employee</th>
                <th>Role</th>
                <th>Shift</th>
                <th style="width: 180px">Status</th>
                <th>Leave Type</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of employees; let i = index">
                <td class="row-num">{{ i + 1 }}</td>
                <td>
                  <div class="employee-cell">
                    <div class="avatar-sm" [style.background]="getAvatarColor(emp.name)">
                      {{ getInitials(emp.name) }}
                    </div>
                    <span>{{ emp.name }}</span>
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
                <td>
                  <div class="status-toggle">
                    <button
                      class="status-btn present-btn"
                      [class.active]="getStatus(emp.id!) === 'Y'"
                      (click)="markAttendance(emp.id!, 'Y')"
                      [disabled]="saving[emp.id!]"
                    >Y</button>
                    <button
                      class="status-btn absent-btn"
                      [class.active]="getStatus(emp.id!) === 'N'"
                      (click)="markAttendance(emp.id!, 'N')"
                      [disabled]="saving[emp.id!]"
                    >N</button>
                  </div>
                </td>
                <td>
                  <span *ngIf="getLeaveType(emp.id!)" class="badge"
                    [ngClass]="{'badge-present': getLeaveType(emp.id!) === 'PAID', 'badge-absent': getLeaveType(emp.id!) === 'SICK'}">
                    {{ getLeaveType(emp.id!) }}
                  </span>
                  <span *ngIf="!getLeaveType(emp.id!)" class="text-muted">&mdash;</span>
                </td>
              </tr>
              <tr *ngIf="employees.length === 0">
                <td colspan="6" class="empty-state">No employees in the system.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { padding: 32px 0 24px; }
    .page-title { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
    .page-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
    .date-selector {
      padding: 16px 20px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .date-controls { display: flex; align-items: center; gap: 12px; }
    .date-display { display: flex; align-items: center; gap: 12px; }
    .date-input { width: 180px; text-align: center; }
    .day-label {
      font-size: 13px; font-weight: 600; color: var(--text-secondary);
      padding: 4px 10px; background: var(--bg-tertiary); border-radius: 100px;
    }
    .day-label.sunday { color: var(--accent-warning); background: var(--accent-warning-dim); }
    .date-stats { display: flex; gap: 16px; }
    .stat { font-size: 12px; font-weight: 600; }
    .stat.present { color: var(--accent-success); }
    .stat.absent { color: var(--accent-danger); }
    .stat.unmarked { color: var(--text-muted); }
    .sunday-notice {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px; margin-bottom: 16px;
      background: var(--accent-warning-dim);
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: var(--radius-sm);
      color: var(--accent-warning); font-size: 13px; font-weight: 500;
    }
    .table-card { overflow: hidden; }
    .row-num { color: var(--text-muted); font-size: 12px; }
    .employee-cell { display: flex; align-items: center; gap: 10px; }
    .avatar-sm {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 600; color: white; flex-shrink: 0;
    }
    .status-toggle { display: flex; gap: 4px; }
    .status-btn {
      width: 44px; height: 32px;
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sm);
      background: var(--bg-tertiary);
      color: var(--text-muted);
      font-family: 'Inter', sans-serif;
      font-size: 13px; font-weight: 600;
      cursor: pointer; transition: var(--transition);
    }
    .status-btn:hover:not(:disabled) { border-color: var(--text-secondary); }
    .present-btn.active {
      background: var(--accent-success);
      border-color: var(--accent-success);
      color: white;
    }
    .absent-btn.active {
      background: var(--accent-danger);
      border-color: var(--accent-danger);
      color: white;
    }
    .status-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .text-muted { color: var(--text-muted); }
    .empty-state { text-align: center; padding: 40px !important; color: var(--text-muted); }
  `]
})
export class AttendanceTrackerComponent implements OnInit {
  selectedDate: string = '';
  employees: Employee[] = [];
  attendanceMap: Map<number, Attendance> = new Map();
  saving: { [key: number]: boolean } = {};

  private clientId: number | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private clientService: ClientService
  ) {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.clientId = this.clientService.getSelectedClientId();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.employeeService.getAll(this.clientId!).subscribe(employees => {
      this.employees = employees;
      this.loadAttendance();
    });
  }

  loadAttendance() {
    this.attendanceService.getByDate(this.selectedDate, this.clientId!).subscribe(records => {
      this.attendanceMap.clear();
      records.forEach(r => {
        if (r.employee && r.employee.id) {
          this.attendanceMap.set(r.employee.id, r);
        }
      });
    });
  }

  onDateChange() {
    this.loadAttendance();
  }

  changeDate(delta: number) {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + delta);
    this.selectedDate = d.toISOString().split('T')[0];
    this.loadAttendance();
  }

  markAttendance(employeeId: number, status: string) {
    this.saving[employeeId] = true;
    this.attendanceService.markAttendance(employeeId, this.selectedDate, status).subscribe({
      next: (result) => {
        this.attendanceMap.set(employeeId, result);
        this.saving[employeeId] = false;
        this.employeeService.getAll(this.clientId!).subscribe(emps => this.employees = emps);
      },
      error: () => {
        this.saving[employeeId] = false;
      }
    });
  }

  getStatus(employeeId: number): string {
    const att = this.attendanceMap.get(employeeId);
    return att ? att.status : '';
  }

  getLeaveType(employeeId: number): string {
    const att = this.attendanceMap.get(employeeId);
    return att ? (att.leaveType || '') : '';
  }

  getPresentCount(): number {
    return Array.from(this.attendanceMap.values()).filter(a => a.status === 'Y').length;
  }

  getAbsentCount(): number {
    return Array.from(this.attendanceMap.values()).filter(a => a.status === 'N').length;
  }

  getUnmarkedCount(): number {
    return this.employees.length - this.attendanceMap.size;
  }

  isSunday(): boolean {
    return new Date(this.selectedDate).getDay() === 0;
  }

  getDayName(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(this.selectedDate).getDay()];
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
