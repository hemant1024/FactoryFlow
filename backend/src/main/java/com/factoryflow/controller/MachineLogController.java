package com.factoryflow.controller;

import com.factoryflow.model.MachineLog;
import com.factoryflow.service.MachineLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/machine-logs")
@RequiredArgsConstructor
public class MachineLogController {

    private final MachineLogService machineLogService;

    @GetMapping
    public ResponseEntity<List<MachineLog>> getLogsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long clientId) {
        return ResponseEntity.ok(machineLogService.getLogsByDate(date, clientId));
    }

    @PostMapping
    public ResponseEntity<MachineLog> createLog(@RequestBody Map<String, Object> request) {
        Long machineId = Long.valueOf(request.get("machineId").toString());
        LocalDate date = LocalDate.parse(request.get("date").toString());
        String shift = request.get("shift").toString();
        Long operatorId = request.get("operatorId") != null ?
            Long.valueOf(request.get("operatorId").toString()) : null;
        Double startReading = request.get("startReading") != null ?
            Double.valueOf(request.get("startReading").toString()) : null;
        Double endReading = request.get("endReading") != null ?
            Double.valueOf(request.get("endReading").toString()) : null;
        Double fuelConsumed = request.get("fuelConsumed") != null ?
            Double.valueOf(request.get("fuelConsumed").toString()) : null;
        String remarks = request.get("remarks") != null ?
            request.get("remarks").toString() : null;

        MachineLog log = machineLogService.createOrUpdateLog(
            machineId, date, shift, operatorId, startReading, endReading, fuelConsumed, remarks);
        return ResponseEntity.status(HttpStatus.CREATED).body(log);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MachineLog> updateLog(@PathVariable Long id,
                                                 @RequestBody Map<String, Object> updates) {
        MachineLog updated = machineLogService.updateLog(id, updates);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        machineLogService.deleteLog(id);
        return ResponseEntity.noContent().build();
    }
}
