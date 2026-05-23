package com.factoryflow.service;

import com.factoryflow.model.Employee;
import com.factoryflow.model.Machine;
import com.factoryflow.model.MachineLog;
import com.factoryflow.repository.EmployeeRepository;
import com.factoryflow.repository.MachineLogRepository;
import com.factoryflow.repository.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MachineLogService {

    private final MachineLogRepository machineLogRepository;
    private final MachineRepository machineRepository;
    private final EmployeeRepository employeeRepository;

    public List<MachineLog> getLogsByDate(LocalDate date, Long clientId) {
        if (clientId != null) {
            return machineLogRepository.findByDateAndMachineClientIdOrderByMachineAscShiftAsc(date, clientId);
        }
        return machineLogRepository.findByDateOrderByMachineAscShiftAsc(date);
    }

    public MachineLog createOrUpdateLog(Long machineId, LocalDate date, String shift,
                                         Long operatorId, Double startReading,
                                         Double endReading, Double fuelConsumed,
                                         String remarks) {
        Machine machine = machineRepository.findById(machineId)
            .orElseThrow(() -> new RuntimeException("Machine not found with id: " + machineId));

        Employee operator = null;
        if (operatorId != null) {
            operator = employeeRepository.findById(operatorId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + operatorId));
        }

        Optional<MachineLog> existing = machineLogRepository.findByMachineIdAndDateAndShift(
            machineId, date, shift);

        MachineLog log;
        if (existing.isPresent()) {
            log = existing.get();
            log.setOperator(operator);
            log.setStartReading(startReading);
            log.setEndReading(endReading);
            log.setFuelConsumed(fuelConsumed);
            log.setRemarks(remarks);
        } else {
            log = MachineLog.builder()
                .machine(machine)
                .date(date)
                .shift(shift)
                .operator(operator)
                .startReading(startReading)
                .endReading(endReading)
                .fuelConsumed(fuelConsumed)
                .remarks(remarks)
                .build();
        }

        return machineLogRepository.save(log);
    }

    public MachineLog updateLog(Long id, Map<String, Object> updates) {
        MachineLog log = machineLogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Machine log not found with id: " + id));

        if (updates.containsKey("operatorId")) {
            Object opId = updates.get("operatorId");
            if (opId != null) {
                Employee operator = employeeRepository.findById(Long.valueOf(opId.toString()))
                    .orElseThrow(() -> new RuntimeException("Employee not found"));
                log.setOperator(operator);
            } else {
                log.setOperator(null);
            }
        }
        if (updates.containsKey("startReading")) {
            log.setStartReading(Double.valueOf(updates.get("startReading").toString()));
        }
        if (updates.containsKey("endReading")) {
            log.setEndReading(Double.valueOf(updates.get("endReading").toString()));
        }
        if (updates.containsKey("fuelConsumed")) {
            log.setFuelConsumed(Double.valueOf(updates.get("fuelConsumed").toString()));
        }
        if (updates.containsKey("remarks")) {
            log.setRemarks((String) updates.get("remarks"));
        }

        return machineLogRepository.save(log);
    }

    public void deleteLog(Long id) {
        machineLogRepository.deleteById(id);
    }
}
