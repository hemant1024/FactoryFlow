package com.factoryflow.controller;

import com.factoryflow.model.Attendance;
import com.factoryflow.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<Attendance>> getAttendanceByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long clientId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date, clientId));
    }

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(@RequestBody Map<String, Object> request) {
        Long employeeId = Long.valueOf(request.get("employeeId").toString());
        LocalDate date = LocalDate.parse(request.get("date").toString());
        String status = request.get("status").toString();

        Attendance attendance = attendanceService.markAttendance(employeeId, date, status);
        return ResponseEntity.status(HttpStatus.CREATED).body(attendance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Attendance> updateAttendance(@PathVariable Long id,
                                                        @RequestBody Map<String, String> request) {
        String status = request.get("status");
        Attendance updated = attendanceService.updateAttendance(id, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Attendance>> getEmployeeMonthlyAttendance(
            @PathVariable Long employeeId,
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(attendanceService.getEmployeeMonthlyAttendance(employeeId, month, year));
    }
}
