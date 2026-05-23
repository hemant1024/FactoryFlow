import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthService } from './core/services/auth.service';
import { ClientService } from './core/services/client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  template: `
    <app-header *ngIf="showHeader()"></app-header>
    <main [class.with-header]="showHeader()">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
    }
    main.with-header {
      padding-top: 64px;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private clientService: ClientService,
    private router: Router
  ) {}

  showHeader(): boolean {
    return this.authService.isLoggedIn() && this.clientService.hasSelectedClient();
  }
}
