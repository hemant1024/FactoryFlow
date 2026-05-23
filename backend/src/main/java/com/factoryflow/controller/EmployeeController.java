package com.factoryflow.controller;

import com.factoryflow.model.Employee;
import com.factoryflow.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<Employee>> getEmployees(
            @RequestParam(required = false) Long clientId) {
        if (clientId != null) {
            return ResponseEntity.ok(employeeService.getEmployeesByClient(clientId));
        }
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Map<String, Object> request) {
        Employee employee = new Employee();
        employee.setName((String) request.get("name"));
        employee.setRole((String) request.get("role"));
        if (request.get("hireDate") != null && !request.get("hireDate").toString().isBlank()) {
            employee.setHireDate(java.time.LocalDate.parse(request.get("hireDate").toString()));
        }
        employee.setDefaultShift((String) request.get("defaultShift"));
        employee.setPhone((String) request.get("phone"));
        employee.setAddress((String) request.get("address"));
        employee.setPan((String) request.get("pan"));
        employee.setPhotoUrl((String) request.get("photoUrl"));

        Long clientId = request.get("clientId") != null ?
            Long.valueOf(request.get("clientId").toString()) : null;

        Employee created = employeeService.createEmployee(employee, clientId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        try {
            Employee updated = employeeService.updateEmployee(id, employee);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/transfer")
    public ResponseEntity<Employee> transferEmployee(@PathVariable Long id,
                                                      @RequestBody Map<String, Object> request) {
        Long clientId = Long.valueOf(request.get("clientId").toString());
        Employee transferred = employeeService.transferEmployee(id, clientId);
        return ResponseEntity.ok(transferred);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
