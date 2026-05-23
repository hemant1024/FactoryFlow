package com.factoryflow.repository;

import com.factoryflow.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByDate(LocalDate date);

    List<Attendance> findByDateAndEmployeeClientId(LocalDate date, Long clientId);

    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.status = 'N' " +
           "AND MONTH(a.date) = :month AND YEAR(a.date) = :year " +
           "AND DAYOFWEEK(a.date) != 1")
    List<Attendance> findAbsencesInMonth(@Param("employeeId") Long employeeId,
                                         @Param("month") int month,
                                         @Param("year") int year);

    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId " +
           "AND MONTH(a.date) = :month AND YEAR(a.date) = :year " +
           "ORDER BY a.date ASC")
    List<Attendance> findByEmployeeAndMonth(@Param("employeeId") Long employeeId,
                                            @Param("month") int month,
                                            @Param("year") int year);
}
