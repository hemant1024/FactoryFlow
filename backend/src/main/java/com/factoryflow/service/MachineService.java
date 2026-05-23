package com.factoryflow.service;

import com.factoryflow.model.Client;
import com.factoryflow.model.Machine;
import com.factoryflow.repository.ClientRepository;
import com.factoryflow.repository.MachineRepository;
import com.factoryflow.repository.MachineLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MachineService {

    private final MachineRepository machineRepository;
    private final MachineLogRepository machineLogRepository;
    private final ClientRepository clientRepository;

    public List<Machine> getMachinesByClient(Long clientId) {
        return machineRepository.findByClientIdOrderByMachineIdAsc(clientId);
    }

    public List<Machine> getAllMachines() {
        return machineRepository.findAllByOrderByMachineIdAsc();
    }

    public Optional<Machine> getMachineById(Long id) {
        return machineRepository.findById(id);
    }

    public Machine createMachine(Machine machine, Long clientId) {
        if (clientId != null) {
            Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + clientId));
            machine.setClient(client);
        }
        return machineRepository.save(machine);
    }

    public Machine transferMachine(Long id, Long newClientId) {
        Machine machine = machineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Machine not found with id: " + id));
        Client newClient = clientRepository.findById(newClientId)
            .orElseThrow(() -> new RuntimeException("Client not found with id: " + newClientId));
        machine.setClient(newClient);
        return machineRepository.save(machine);
    }

    @Transactional
    public void deleteMachine(Long id) {
        machineLogRepository.deleteByMachineId(id);
        machineRepository.deleteById(id);
    }
}
