import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MachineService, Machine } from '../../../core/services/machine.service';
import { MachineLogService, MachineLog } from '../../../core/services/machine-log.service';
import { EmployeeService, Employee } from '../../../core/services/employee.service';
import { ClientService } from '../../../core/services/client.service';

interface LedgerRow {
  machine: Machine;
  morning: MachineLog | null;
  night: MachineLog | null;
}

interface ShiftEdit {
  operatorId: number | null;
  startReading: number | null;
  endReading: number | null;
  fuelConsumed: number | null;
  remarks: string;
  dirty: boolean;
  saving: boolean;
}

@Component({
  selector: 'app-daily-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-enter">
      <div class="page-header">
        <div>
          <h1 class="page-title">Daily Ledger</h1>
          <p class="page-subtitle">Machine operations log with split shift tracking</p>
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
          <input type="date" class="form-control date-input" [(ngModel)]="selectedDate" (change)="onDateChange()" />
          <button class="btn btn-ghost btn-sm" (click)="changeDate(1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Ledger Table -->
      <div class="card table-card">
        <div class="table-wrapper">
          <table class="data-table ledger-table">
            <thead>
              <tr>
                <th class="col-machine">Machine</th>
                <th class="col-shift">Shift</th>
                <th class="col-operator">Operator</th>
                <th class="col-reading">Start Reading</th>
                <th class="col-reading">End Reading</th>
                <th class="col-fuel">Fuel (L)</th>
                <th class="col-remarks">Remarks</th>
                <th class="col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngFor="let row of ledgerRows">
                <!-- Morning Row -->
                <tr class="morning-row">
                  <td class="machine-cell" rowspan="2">
                    <div class="machine-info">
                      <span class="machine-id-badge">{{ row.machine.machineId }}</span>
                      <span class="machine-type">{{ row.machine.type }}</span>
                    </div>
                  </td>
                  <td><span class="badge badge-morning">Morning</span></td>
                  <td>
                    <select class="form-control form-control-sm"
                      [(ngModel)]="getEdit(row.machine.id!, 'MORNING').operatorId"
                      (change)="markDirty(row.machine.id!, 'MORNING')">
                      <option [ngValue]="null">&mdash; Select &mdash;</option>
                      <option *ngFor="let emp of employees" [ngValue]="emp.id">{{ emp.name }}</option>
                    </select>
                  </td>
                  <td>
                    <input type="number" class="form-control form-control-sm"
                      [(ngModel)]="getEdit(row.machine.id!, 'MORNING').startReading"
                      (input)="markDirty(row.machine.id!, 'MORNING')" placeholder="0" />
                  </td>
                  <td>
                    <input type="number" class="form-control form-control-sm"
                      [(ngModel)]="getEdit(row.machine.id!, 'MORNING').endReading"
                      (input)="markDirty(row.machine.id!, 'MORNING')" placeholder="0" />
                  </td>
                  <td>
                    <input type="number" class="form-control form-control-sm"
                      [(ngModel)]="getEdit(row.machine.id!, 'MORNING').fuelConsumed"
                      (input)="markDirty(row.machine.id!, 'MORNING')" placeholder="0" />
                  </td>
                  <td>
                    <input class="form-control form-control-sm"
                      [(ngModel)]="getEdit(row.machine.id!, 'MORNING').remarks"
                      (input)="markDirty(row.machine.id!, 'MORNING')" placeholder="Notes..." />
                  </td>
                  <td>
                    <button class="btn btn-primary btn-sm"
                      (click)="saveShift(row.machine.id!, 'MORNING')"
                      [disabled]="!getEdit(row.machine.id!, 'MORNING').dirty || getEdit(row.machine.id!, 'MORNING').saving">
                      {{ getEdit(row.machine.id!, 'MORNING').saving ? '...' : 'Save' }}
                    </button>
                  </td>
                </tr>
                <!-- Night Row -->
                <tr class="night-row">
                  <td><span class="badge badge-night">Night</span></td>
                  <td>
                    <select class="form-control form-control-sm"
                      [(ngModel)]="getEdit(row.machine.id!, 'NIGHT').operatorId"
                      (change)="markDirty(row.machine.id!, 'NIGHT')">
                      <option [ngValue]="null">&mdash; Select &mdash;</option>
                      <option *ngFor="let emp of employees" [ngValue]="emp.id">{{ emp.name }}</option>
                    </select>
                  </td>
                  <td>
                    <input type="number" class="form-control form-control-sm"
                      [(ngModel)]="getEdit(row.machine.id!, 'NIGHT').startReading"
                      (input)="markDirty(row.machine.id!, 'NIGHT')" placeholder="0" />
                  </td>
                  <td>
                    <input type="number" class="form-control form-control-sm"
                      [(ngModel)]="getEdit(row.machine.id!, 'NIGHT').endReading"
                      (input)="markDirty(row.machine.id!, 'NIGHT')" placeholder="0" />
                  </td>
                  <td>
                    <input type="number" class="form-control form-control-sm"
                      [(ngModel)]="getEdit(row.machine.id!, 'NIGHT').fuelConsumed"
                      (input)="markDirty(row.machine.id!, 'NIGHT')" placeholder="0" />
                  </td>
                  <td>
                    <input class="form-control form-control-sm"
                      [(ngModel)]="getEdit(row.machine.id!, 'NIGHT').remarks"
                      (input)="markDirty(row.machine.id!, 'NIGHT')" placeholder="Notes..." />
                  </td>
                  <td>
                    <button class="btn btn-primary btn-sm"
                      (click)="saveShift(row.machine.id!, 'NIGHT')"
                      [disabled]="!getEdit(row.machine.id!, 'NIGHT').dirty || getEdit(row.machine.id!, 'NIGHT').saving">
                      {{ getEdit(row.machine.id!, 'NIGHT').saving ? '...' : 'Save' }}
                    </button>
                  </td>
                </tr>
              </ng-container>
              <tr *ngIf="ledgerRows.length === 0">
                <td colspan="8" class="empty-state">No machines registered. Add machines in Fleet Management first.</td>
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
    .date-selector { padding: 16px 20px; margin-bottom: 24px; }
    .date-controls {
      display: flex; align-items: center; gap: 12px; justify-content: center;
    }
    .date-input { width: 180px; text-align: center; }
    .table-card { overflow: hidden; }
    .ledger-table { min-width: 900px; }
    .machine-cell {
      vertical-align: middle !important;
      border-right: 2px solid var(--border-strong);
    }
    .machine-info { display: flex; flex-direction: column; gap: 4px; }
    .machine-id-badge {
      font-weight: 700; font-size: 14px; color: var(--accent-primary);
    }
    .machine-type { font-size: 11px; color: var(--text-muted); }
    .morning-row td { border-bottom: 1px dashed var(--border) !important; }
    .night-row td { border-bottom: 2px solid var(--border-strong) !important; }
    .form-control-sm { padding: 6px 10px; font-size: 12px; }
    input[type="number"].form-control-sm { width: 90px; }
    .empty-state { text-align: center; padding: 40px !important; color: var(--text-muted); }
  `]
})
export class DailyLedgerComponent implements OnInit {
  selectedDate: string = '';
  machines: Machine[] = [];
  employees: Employee[] = [];
  ledgerRows: LedgerRow[] = [];
  edits: Map<string, ShiftEdit> = new Map();

  private clientId: number | null = null;

  constructor(
    private machineService: MachineService,
    private machineLogService: MachineLogService,
    private employeeService: EmployeeService,
    private clientService: ClientService
  ) {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.clientId = this.clientService.getSelectedClientId();
  }

  ngOnInit() {
    this.employeeService.getAll(this.clientId!).subscribe(emps => {
      this.employees = emps;
      this.loadData();
    });
  }

  loadData() {
    this.machineService.getAll(this.clientId!).subscribe(machines => {
      this.machines = machines;
      this.machineLogService.getByDate(this.selectedDate, this.clientId!).subscribe(logs => {
        this.buildLedgerRows(machines, logs);
      });
    });
  }

  buildLedgerRows(machines: Machine[], logs: MachineLog[]) {
    this.ledgerRows = machines.map(machine => {
      const morning = logs.find(l => l.machine.id === machine.id && l.shift === 'MORNING') || null;
      const night = logs.find(l => l.machine.id === machine.id && l.shift === 'NIGHT') || null;

      this.initEdit(machine.id!, 'MORNING', morning);
      this.initEdit(machine.id!, 'NIGHT', night);

      return { machine, morning, night };
    });
  }

  initEdit(machineId: number, shift: string, log: MachineLog | null) {
    const key = `${machineId}_${shift}`;
    this.edits.set(key, {
      operatorId: log?.operator?.id || null,
      startReading: log?.startReading || null,
      endReading: log?.endReading || null,
      fuelConsumed: log?.fuelConsumed || null,
      remarks: log?.remarks || '',
      dirty: false,
      saving: false
    });
  }

  getEdit(machineId: number, shift: string): ShiftEdit {
    const key = `${machineId}_${shift}`;
    if (!this.edits.has(key)) {
      this.edits.set(key, {
        operatorId: null, startReading: null, endReading: null,
        fuelConsumed: null, remarks: '', dirty: false, saving: false
      });
    }
    return this.edits.get(key)!;
  }

  markDirty(machineId: number, shift: string) {
    this.getEdit(machineId, shift).dirty = true;
  }

  saveShift(machineId: number, shift: string) {
    const edit = this.getEdit(machineId, shift);
    edit.saving = true;

    this.machineLogService.create({
      machineId: machineId,
      date: this.selectedDate,
      shift: shift,
      operatorId: edit.operatorId,
      startReading: edit.startReading,
      endReading: edit.endReading,
      fuelConsumed: edit.fuelConsumed,
      remarks: edit.remarks
    }).subscribe({
      next: () => {
        edit.dirty = false;
        edit.saving = false;
      },
      error: () => {
        edit.saving = false;
      }
    });
  }

  onDateChange() {
    this.loadData();
  }

  changeDate(delta: number) {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + delta);
    this.selectedDate = d.toISOString().split('T')[0];
    this.loadData();
  }
}
