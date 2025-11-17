package com.example.aloclock.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aloclock.model.Employee;
import com.example.aloclock.model.TimeRecord;

public interface TimeRecordRepository extends JpaRepository<TimeRecord, Long> {

    List<TimeRecord> findByEmpleado(Employee empleado);

    List<TimeRecord> findByEmpleadoAndFechaBetween(Employee empleado, LocalDate start, LocalDate end);

    Optional<TimeRecord> findTopByEmpleadoOrderByInstanteDesc(Employee empleado);
}