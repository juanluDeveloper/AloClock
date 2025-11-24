package com.example.aloclock.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aloclock.model.Employee;
import com.example.aloclock.model.Incidencia;
import com.example.aloclock.model.enums.IncidentStatus;

public interface IncidenciaRepository extends JpaRepository<Incidencia, Long> {

    List<Incidencia> findByEmpleadoOrderByCreatedAtDesc(Employee empleado);

    List<Incidencia> findByEstadoOrderByCreatedAtDesc(IncidentStatus estado);

    // para listado completo admin
    List<Incidencia> findAllByOrderByCreatedAtDesc();
}
