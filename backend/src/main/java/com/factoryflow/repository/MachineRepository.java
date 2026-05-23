package com.factoryflow.repository;

import com.factoryflow.model.Machine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    List<Machine> findAllByOrderByMachineIdAsc();
    List<Machine> findByClientIdOrderByMachineIdAsc(Long clientId);
}
