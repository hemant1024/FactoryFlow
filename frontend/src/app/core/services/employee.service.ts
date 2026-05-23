import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id?: number;
  name: string;
  role: string;
  hireDate: string;
  defaultShift: string;
  phone: string;
  address: string;
  pan: string;
  photoUrl: string;
  paidLeaveBalance?: number;
  sickLeaveBalance?: number;
  client?: any;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {}

  getAll(clientId?: number): Observable<Employee[]> {
    const params = clientId ? `?clientId=${clientId}` : '';
    return this.http.get<Employee[]>(`${this.apiUrl}${params}`);
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(employee: any): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  update(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  transfer(id: number, clientId: number): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}/transfer`, { clientId });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
