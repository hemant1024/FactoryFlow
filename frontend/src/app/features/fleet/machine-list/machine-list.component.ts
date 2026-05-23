import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MachineService, Machine } from '../../../core/services/machine.service';
import { ClientService, Client } from '../../../core/services/client.service';

@Component({
  selector: 'app-machine-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-enter">
      <div class="page-header">
        <div>
          <h1 class="page-title">Fleet Management</h1>
          <p class="page-subtitle">Machine asset registry and lifecycle</p>
        </div>
        <button class="btn btn-primary" (click)="toggleAddForm()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Machine
        </button>
      </div>

      <!-- Add Machine Form -->
      <div class="add-form card" *ngIf="showAddForm">
        <div class="add-form-header">
          <h3>New Machine</h3>
          <button class="btn btn-ghost btn-sm" (click)="toggleAddForm()">Cancel</button>
        </div>
        <div class="add-form-body">
          <div class="form-grid-3">
            <div class="form-group">
              <label>Machine ID *</label>
              <input class="form-control" [(ngModel)]="newMachine.machineId" placeholder="e.g. EX-004" />
            </div>
            <div class="form-group">
              <label>Type *</label>
              <select class="form-control" [(ngModel)]="newMachine.type">
                <option value="">Select type</option>
                <option value="Excavator">Excavator</option>
                <option value="Bulldozer">Bulldozer</option>
                <option value="Loader">Loader</option>
                <option value="Crane">Crane</option>
                <option value="Truck">Truck</option>
                <option value="Roller">Roller</option>
              </select>
            </div>
            <div class="form-group">
              <label>License Plate</label>
              <input class="form-control" [(ngModel)]="newMachine.licensePlate" placeholder="e.g. MH-12-XX-1234" />
            </div>
          </div>
          <div class="add-form-actions">
            <button class="btn btn-success" (click)="addMachine()" [disabled]="!newMachine.machineId || !newMachine.type">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Save Machine
            </button>
          </div>
        </div>
      </div>

      <!-- Machine Table -->
      <div class="card table-card">
        <div class="table-info">
          <span class="record-count">{{ machines.length }} machines</span>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Machine ID</th>
                <th>Type</th>
                <th>License Plate</th>
                <th>Registered</th>
                <th style="width: 240px">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of machines">
                <td>
                  <span class="machine-id">{{ m.machineId }}</span>
                </td>
                <td>
                  <div class="type-cell">
                    <span class="type-icon">{{ getTypeIcon(m.type) }}</span>
                    {{ m.type }}
                  </div>
                </td>
                <td>{{ m.licensePlate || '\u2014' }}</td>
                <td>{{ m.createdAt | date:'mediumDate' }}</td>
                <td>
                  <div class="action-row">
                    <div class="transfer-inline">
                      <select class="form-control form-control-sm" [(ngModel)]="transferTargets[m.id!]">
                        <option [ngValue]="undefined">Transfer to...</option>
                        <option *ngFor="let c of clients" [ngValue]="c.id">{{ c.name }}</option>
                      </select>
                      <button class="btn btn-warning btn-xs" (click)="transferMachine(m)"
                        [disabled]="!transferTargets[m.id!]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="15 3 21 3 21 9"/><path d="M21 3l-7 7"/>
                        </svg>
                      </button>
                    </div>
                    <button class="btn btn-danger btn-sm" (click)="deleteMachine(m)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="machines.length === 0">
                <td colspan="5" class="empty-state">No machines registered. Add your first machine above.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex; align-items: center; justify-content: space-between; padding: 32px 0 24px;
    }
    .page-title { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
    .page-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
    .add-form { margin-bottom: 24px; overflow: hidden; animation: slideUp 0.3s ease; }
    .add-form-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-bottom: 1px solid var(--border);
    }
    .add-form-header h3 { font-size: 15px; font-weight: 600; }
    .add-form-body { padding: 20px; }
    .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .add-form-actions { margin-top: 20px; display: flex; justify-content: flex-end; }
    .table-card { overflow: hidden; }
    .table-info { padding: 16px 20px; border-bottom: 1px solid var(--border); }
    .record-count {
      font-size: 12px; color: var(--text-muted); font-weight: 500;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .machine-id { font-weight: 600; color: var(--accent-primary); }
    .type-cell { display: flex; align-items: center; gap: 8px; }
    .type-icon { font-size: 16px; }
    .empty-state { text-align: center; padding: 40px !important; color: var(--text-muted); }
    .action-row {
      display: flex; align-items: center; gap: 8px;
    }
    .transfer-inline {
      display: flex; align-items: center; gap: 4px;
    }
    .transfer-inline select {
      width: 130px; padding: 4px 8px; font-size: 11px;
    }
    .btn-xs {
      padding: 4px 8px;
      font-size: 11px;
      border-radius: var(--radius-sm);
    }
    .btn-warning {
      display: inline-flex; align-items: center;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: var(--accent-warning);
      font-family: 'Inter', sans-serif;
      cursor: pointer; transition: var(--transition);
    }
    .btn-warning:hover:not(:disabled) {
      background: rgba(245, 158, 11, 0.25);
      border-color: var(--accent-warning);
    }
    .btn-warning:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class MachineListComponent implements OnInit {
  machines: Machine[] = [];
  clients: Client[] = [];
  showAddForm = false;
  newMachine: Machine = { machineId: '', type: '', licensePlate: '' };
  transferTargets: { [key: number]: number | undefined } = {};
  private clientId: number | null = null;

  constructor(
    private machineService: MachineService,
    private clientService: ClientService
  ) {
    this.clientId = this.clientService.getSelectedClientId();
  }

  ngOnInit() {
    this.loadMachines();
    this.clientService.getAll().subscribe(clients => {
      // Exclude current client from transfer targets
      this.clients = clients.filter(c => c.id !== this.clientId);
    });
  }

  loadMachines() {
    this.machineService.getAll(this.clientId!).subscribe(data => this.machines = data);
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.newMachine = { machineId: '', type: '', licensePlate: '' };
    }
  }

  addMachine() {
    if (!this.newMachine.machineId || !this.newMachine.type) return;
    const payload = { ...this.newMachine, clientId: this.clientId };
    this.machineService.create(payload).subscribe({
      next: () => {
        this.loadMachines();
        this.showAddForm = false;
      },
      error: (err) => {
        console.error('Create machine error:', err);
        alert(err.error?.message || 'Failed to create machine. Check console.');
      }
    });
  }

  transferMachine(machine: Machine) {
    const targetId = this.transferTargets[machine.id!];
    if (!targetId) return;
    const targetClient = this.clients.find(c => c.id === targetId);
    if (confirm(`Transfer ${machine.machineId} to ${targetClient?.name}?`)) {
      this.machineService.transfer(machine.id!, targetId).subscribe(() => {
        this.transferTargets[machine.id!] = undefined;
        this.loadMachines();
      });
    }
  }

  deleteMachine(machine: Machine) {
    if (confirm(`Delete machine ${machine.machineId}? This will permanently remove the machine and all associated logs.`)) {
      this.machineService.delete(machine.id!).subscribe(() => this.loadMachines());
    }
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Excavator': '\ud83c\udfd7\ufe0f', 'Bulldozer': '\ud83d\ude9c', 'Loader': '\ud83c\udfed',
      'Crane': '\ud83c\udfd7\ufe0f', 'Truck': '\ud83d\ude9b', 'Roller': '\ud83d\udea7'
    };
    return icons[type] || '\u2699\ufe0f';
  }
}
