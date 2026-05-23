import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MachineLog {
  id?: number;
  machine: any;
  date: string;
  shift: string;
  operator: any;
  startReading: number;
  endReading: number;
  fuelConsumed: number;
  remarks: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class MachineLogService {
  private apiUrl = 'http://localhost:8080/api/machine-logs';

  constructor(private http: HttpClient) {}

  getByDate(date: string, clientId?: number): Observable<MachineLog[]> {
    let url = `${this.apiUrl}?date=${date}`;
    if (clientId) {
      url += `&clientId=${clientId}`;
    }
    return this.http.get<MachineLog[]>(url);
  }

  create(log: any): Observable<MachineLog> {
    return this.http.post<MachineLog>(this.apiUrl, log);
  }

  update(id: number, updates: any): Observable<MachineLog> {
    return this.http.put<MachineLog>(`${this.apiUrl}/${id}`, updates);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
