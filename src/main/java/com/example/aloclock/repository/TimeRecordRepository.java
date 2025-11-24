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

    // Para el usuario (solo registros activos)
    List<TimeRecord> findByEmpleadoAndEliminadoFalse(Employee empleado);

    List<TimeRecord> findByEmpleadoAndFechaBetweenAndEliminadoFalse(
            Employee empleado,
            LocalDate start,
            LocalDate end
    );

    List<TimeRecord> findByEmpleadoAndEliminadoFalseOrderByInstanteAsc(Employee empleado);

    List<TimeRecord> findByEmpleadoAndFechaBetweenAndEliminadoFalseOrderByInstanteAsc(
            Employee empleado,
            LocalDate start,
            LocalDate end
    );
}