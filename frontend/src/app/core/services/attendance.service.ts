import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Attendance {
  id?: number;
  employee: any;
  date: string;
  status: string;
  leaveType?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private apiUrl = 'http://localhost:8080/api/attendance';

  constructor(private http: HttpClient) {}

  getByDate(date: string, clientId?: number): Observable<Attendance[]> {
    let url = `${this.apiUrl}?date=${date}`;
    if (clientId) {
      url += `&clientId=${clientId}`;
    }
    return this.http.get<Attendance[]>(url);
  }

  markAttendance(employeeId: number, date: string, status: string): Observable<Attendance> {
    return this.http.post<Attendance>(this.apiUrl, { employeeId, date, status });
  }

  getEmployeeMonthly(employeeId: number, month: number, year: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/employee/${employeeId}?month=${month}&year=${year}`);
  }
}
