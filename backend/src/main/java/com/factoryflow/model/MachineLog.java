package com.factoryflow.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "machine_logs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"machine_id", "date", "shift"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 10)
    private String shift; // "MORNING" or "NIGHT"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "operator_id")
    private Employee operator;

    @Column(name = "start_reading")
    private Double startReading;

    @Column(name = "end_reading")
    private Double endReading;

    @Column(name = "fuel_consumed")
    private Double fuelConsumed;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
