import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  id?: number;
  name: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private apiUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  selectClient(client: Client): void {
    localStorage.setItem('ff_client_id', String(client.id));
    localStorage.setItem('ff_client_name', client.name);
  }

  clearClient(): void {
    localStorage.removeItem('ff_client_id');
    localStorage.removeItem('ff_client_name');
  }

  getSelectedClientId(): number | null {
    const id = localStorage.getItem('ff_client_id');
    return id ? Number(id) : null;
  }

  getSelectedClientName(): string {
    return localStorage.getItem('ff_client_name') || '';
  }

  hasSelectedClient(): boolean {
    return !!localStorage.getItem('ff_client_id');
  }
}
