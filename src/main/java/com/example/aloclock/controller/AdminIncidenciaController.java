package com.example.aloclock.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.aloclock.dto.IncidentDecisionRequest;
import com.example.aloclock.model.Incidencia;
import com.example.aloclock.model.enums.IncidentStatus;
import com.example.aloclock.service.IncidenciaService;

@RestController
@RequestMapping("/api/admin/incidencias")
@PreAuthorize("hasRole('ADMIN')")
public class AdminIncidenciaController {

    private final IncidenciaService incidenciaService;

    public AdminIncidenciaController(IncidenciaService incidenciaService) {
        this.incidenciaService = incidenciaService;
    }

    @GetMapping
    public List<Incidencia> listar(@RequestParam(required = false) IncidentStatus estado) {
        return incidenciaService.listarTodas(estado);
    }

    @PostMapping("/{id}/aprobar")
    public Incidencia aprobar(@PathVariable Long id,
                              @RequestBody(required = false) IncidentDecisionRequest req,
                              Authentication auth) {
        // comentarioAdmin por ahora no lo usamos para aprobar,
        // pero puedes añadirlo a la incidencia si quieres:
        Incidencia inc = incidenciaService.aprobarIncidencia(id, auth.getName());
        if (req != null && req.getComentarioAdmin() != null) {
            inc.setComentarioAdmin(req.getComentarioAdmin());
        }
        return inc;
    }

    @PostMapping("/{id}/rechazar")
    public Incidencia rechazar(@PathVariable Long id,
                               @RequestBody IncidentDecisionRequest req,
                               Authentication auth) {
        return incidenciaService.rechazarIncidencia(
                id,
                auth.getName(),
                req.getComentarioAdmin()
        );
    }
}
