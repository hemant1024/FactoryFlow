package com.factoryflow.repository;

import com.factoryflow.model.MachineLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MachineLogRepository extends JpaRepository<MachineLog, Long> {
    List<MachineLog> findByDateOrderByMachineAscShiftAsc(LocalDate date);
    List<MachineLog> findByDateAndMachineClientIdOrderByMachineAscShiftAsc(LocalDate date, Long clientId);
    Optional<MachineLog> findByMachineIdAndDateAndShift(Long machineId, LocalDate date, String shift);
    void deleteByMachineId(Long machineId);
}
