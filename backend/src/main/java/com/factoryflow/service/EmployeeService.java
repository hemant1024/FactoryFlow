package com.factoryflow.service;

import com.factoryflow.model.Client;
import com.factoryflow.model.Employee;
import com.factoryflow.repository.ClientRepository;
import com.factoryflow.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final ClientRepository clientRepository;

    public List<Employee> getEmployeesByClient(Long clientId) {
        return employeeRepository.findByClientIdOrderByNameAsc(clientId);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAllByOrderByNameAsc();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public Employee createEmployee(Employee employee, Long clientId) {
        if (clientId != null) {
            Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + clientId));
            employee.setClient(client);
        }
        if (employee.getPaidLeaveBalance() == null) {
            employee.setPaidLeaveBalance(12);
        }
        if (employee.getSickLeaveBalance() == null) {
            employee.setSickLeaveBalance(12);
        }
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        return employeeRepository.findById(id)
            .map(existing -> {
                existing.setName(updatedEmployee.getName());
                existing.setRole(updatedEmployee.getRole());
                existing.setHireDate(updatedEmployee.getHireDate());
                existing.setDefaultShift(updatedEmployee.getDefaultShift());
                existing.setPhone(updatedEmployee.getPhone());
                existing.setAddress(updatedEmployee.getAddress());
                existing.setPan(updatedEmployee.getPan());
                existing.setPhotoUrl(updatedEmployee.getPhotoUrl());
                return employeeRepository.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    public Employee transferEmployee(Long id, Long newClientId) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        Client newClient = clientRepository.findById(newClientId)
            .orElseThrow(() -> new RuntimeException("Client not found with id: " + newClientId));
        employee.setClient(newClient);
        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
