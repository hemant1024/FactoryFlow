package com.factoryflow.service;

import com.factoryflow.model.Attendance;
import com.factoryflow.model.Employee;
import com.factoryflow.repository.AttendanceRepository;
import com.factoryflow.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public List<Attendance> getAttendanceByDate(LocalDate date, Long clientId) {
        if (clientId != null) {
            return attendanceRepository.findByDateAndEmployeeClientId(date, clientId);
        }
        return attendanceRepository.findByDate(date);
    }

    public List<Attendance> getEmployeeMonthlyAttendance(Long employeeId, int month, int year) {
        return attendanceRepository.findByEmployeeAndMonth(employeeId, month, year);
    }

    @Transactional
    public Attendance markAttendance(Long employeeId, LocalDate date, String status) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));

        // Check if attendance already exists for this employee on this date
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, date);

        if (existing.isPresent()) {
            // Update existing record
            Attendance attendance = existing.get();
            String previousStatus = attendance.getStatus();
            attendance.setStatus(status);

            // If changing from N to Y, reverse leave deduction
            if ("N".equals(previousStatus) && "Y".equals(status) && date.getDayOfWeek() != DayOfWeek.SUNDAY) {
                if ("PAID".equals(attendance.getLeaveType())) {
                    employee.setPaidLeaveBalance(employee.getPaidLeaveBalance() + 1);
                } else if ("SICK".equals(attendance.getLeaveType())) {
                    employee.setSickLeaveBalance(employee.getSickLeaveBalance() + 1);
                }
                attendance.setLeaveType(null);
                employeeRepository.save(employee);
            }
            // If changing from Y to N, apply leave deduction
            else if ("Y".equals(previousStatus) && "N".equals(status) && date.getDayOfWeek() != DayOfWeek.SUNDAY) {
                applyLeaveDeduction(employee, attendance, date);
                employeeRepository.save(employee);
            }

            return attendanceRepository.save(attendance);
        } else {
            // Create new attendance record
            Attendance attendance = Attendance.builder()
                .employee(employee)
                .date(date)
                .status(status)
                .build();

            // Apply leave deduction if absent on non-Sunday
            if ("N".equals(status) && date.getDayOfWeek() != DayOfWeek.SUNDAY) {
                applyLeaveDeduction(employee, attendance, date);
                employeeRepository.save(employee);
            }

            return attendanceRepository.save(attendance);
        }
    }

    /**
     * Leave Deduction Rules Engine:
     * - First absence in a month (non-Sunday): deduct from paid_leave_balance (floor at 0)
     * - Subsequent absences: deduct from sick_leave_balance (can go negative)
     */
    private void applyLeaveDeduction(Employee employee, Attendance attendance, LocalDate date) {
        int month = date.getMonthValue();
        int year = date.getYear();

        // Count existing absences this month (excluding Sundays) BEFORE this one
        List<Attendance> existingAbsences = attendanceRepository.findAbsencesInMonth(
            employee.getId(), month, year);

        if (existingAbsences.isEmpty()) {
            // First absence this month -> deduct from paid leave
            if (employee.getPaidLeaveBalance() > 0) {
                employee.setPaidLeaveBalance(employee.getPaidLeaveBalance() - 1);
            }
            attendance.setLeaveType("PAID");
        } else {
            // Subsequent absence -> deduct from sick leave (can go negative)
            employee.setSickLeaveBalance(employee.getSickLeaveBalance() - 1);
            attendance.setLeaveType("SICK");
        }
    }

    @Transactional
    public Attendance updateAttendance(Long id, String status) {
        Attendance attendance = attendanceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Attendance record not found with id: " + id));
        attendance.setStatus(status);
        return attendanceRepository.save(attendance);
    }
}
