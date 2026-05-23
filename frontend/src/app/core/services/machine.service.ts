import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Machine {
  id?: number;
  machineId: string;
  type: string;
  licensePlate: string;
  client?: any;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class MachineService {
  private apiUrl = 'http://localhost:8080/api/machines';

  constructor(private http: HttpClient) {}

  getAll(clientId?: number): Observable<Machine[]> {
    const params = clientId ? `?clientId=${clientId}` : '';
    return this.http.get<Machine[]>(`${this.apiUrl}${params}`);
  }

  create(machine: any): Observable<Machine> {
    return this.http.post<Machine>(this.apiUrl, machine);
  }

  transfer(id: number, clientId: number): Observable<Machine> {
    return this.http.put<Machine>(`${this.apiUrl}/${id}/transfer`, { clientId });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
