package com.factoryflow.controller;

import com.factoryflow.model.Machine;
import com.factoryflow.service.MachineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/machines")
@RequiredArgsConstructor
public class MachineController {

    private final MachineService machineService;

    @GetMapping
    public ResponseEntity<List<Machine>> getMachines(
            @RequestParam(required = false) Long clientId) {
        if (clientId != null) {
            return ResponseEntity.ok(machineService.getMachinesByClient(clientId));
        }
        return ResponseEntity.ok(machineService.getAllMachines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Machine> getMachineById(@PathVariable Long id) {
        return machineService.getMachineById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Machine> createMachine(@RequestBody Map<String, Object> request) {
        Machine machine = new Machine();
        machine.setMachineId((String) request.get("machineId"));
        machine.setType((String) request.get("type"));
        machine.setLicensePlate((String) request.get("licensePlate"));

        Long clientId = request.get("clientId") != null ?
            Long.valueOf(request.get("clientId").toString()) : null;

        Machine created = machineService.createMachine(machine, clientId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/transfer")
    public ResponseEntity<Machine> transferMachine(@PathVariable Long id,
                                                    @RequestBody Map<String, Object> request) {
        Long clientId = Long.valueOf(request.get("clientId").toString());
        Machine transferred = machineService.transferMachine(id, clientId);
        return ResponseEntity.ok(transferred);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable Long id) {
        machineService.deleteMachine(id);
        return ResponseEntity.noContent().build();
    }
}
