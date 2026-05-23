import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { clientGuard } from './core/guards/client.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'clients',
    canActivate: [authGuard],
    loadComponent: () => import('./features/client-select/client-select.component').then(m => m.ClientSelectComponent)
  },
  {
    path: 'workforce',
    canActivate: [authGuard, clientGuard],
    loadComponent: () => import('./features/workforce/employee-list/employee-list.component').then(m => m.EmployeeListComponent)
  },
  {
    path: 'workforce/attendance',
    canActivate: [authGuard, clientGuard],
    loadComponent: () => import('./features/workforce/attendance-tracker/attendance-tracker.component').then(m => m.AttendanceTrackerComponent)
  },
  {
    path: 'fleet',
    canActivate: [authGuard, clientGuard],
    loadComponent: () => import('./features/fleet/machine-list/machine-list.component').then(m => m.MachineListComponent)
  },
  {
    path: 'fleet/ledger',
    canActivate: [authGuard, clientGuard],
    loadComponent: () => import('./features/fleet/daily-ledger/daily-ledger.component').then(m => m.DailyLedgerComponent)
  },
  { path: '**', redirectTo: '/login' }
];
