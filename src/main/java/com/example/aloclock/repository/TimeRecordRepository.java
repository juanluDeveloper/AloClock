package com.example.aloclock.repository;

import com.example.aloclock.model.TimeRecord;
import com.example.aloclock.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TimeRecordRepository extends JpaRepository<TimeRecord, Long> {
    List<TimeRecord> findByEmpleado(Employee empleado);
    List<TimeRecord> findByEmpleadoAndFechaBetween(Employee empleado, LocalDate start, LocalDate end);
}