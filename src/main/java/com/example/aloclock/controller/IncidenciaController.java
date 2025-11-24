package com.example.aloclock.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aloclock.dto.IncidentAddRequest;
import com.example.aloclock.dto.IncidentDeleteRequest;
import com.example.aloclock.dto.IncidentEditRequest;
import com.example.aloclock.model.Employee;
import com.example.aloclock.model.Incidencia;
import com.example.aloclock.service.EmployeeService;
import com.example.aloclock.service.IncidenciaService;

@RestController
@RequestMapping("/api/incidencias")
public class IncidenciaController {

    private final IncidenciaService incidenciaService;
    private final EmployeeService employeeService;

    public IncidenciaController(IncidenciaService incidenciaService,
                                EmployeeService employeeService) {
        this.incidenciaService = incidenciaService;
        this.employeeService = employeeService;
    }

    private Employee getCurrentEmployee(Authentication auth) {
        return employeeService.findByEmail(auth.getName()).orElseThrow();
    }

    @PostMapping("/add")
    public Incidencia crearIncidenciaAdd(@RequestBody IncidentAddRequest req,
                                         Authentication auth) {
        Employee empleado = getCurrentEmployee(auth);
        return incidenciaService.crearIncidenciaAdd(
                empleado,
                req.getRecordType(),
                req.getFecha(),
                req.getHora(),
                req.getComentario()
        );
    }

    @PostMapping("/delete")
    public Incidencia crearIncidenciaDelete(@RequestBody IncidentDeleteRequest req,
                                            Authentication auth) {
        Employee empleado = getCurrentEmployee(auth);
        return incidenciaService.crearIncidenciaDelete(
                empleado,
                req.getTimeRecordId(),
                req.getComentario()
        );
    }

    @PostMapping("/edit")
    public Incidencia crearIncidenciaEdit(@RequestBody IncidentEditRequest req,
                                          Authentication auth) {
        Employee empleado = getCurrentEmployee(auth);
        return incidenciaService.crearIncidenciaEdit(
                empleado,
                req.getTimeRecordId(),
                req.getFecha(),
                req.getHora(),
                req.getComentario()
        );
    }

    @GetMapping("/mis")
    public List<Incidencia> misIncidencias(Authentication auth) {
        Employee empleado = getCurrentEmployee(auth);
        return incidenciaService.misIncidencias(empleado);
    }
}
