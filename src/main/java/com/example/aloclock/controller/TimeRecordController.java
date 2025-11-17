package com.example.aloclock.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.aloclock.dto.JornadaResumenDto;
import com.example.aloclock.model.Employee;
import com.example.aloclock.model.TimeRecord;
import com.example.aloclock.model.enums.RecordType;
import com.example.aloclock.service.EmployeeService;
import com.example.aloclock.service.TimeRecordService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class TimeRecordController {

    private final EmployeeService employeeService;
    private final TimeRecordService timeRecordService;

    public TimeRecordController(EmployeeService employeeService, TimeRecordService timeRecordService) {
        this.employeeService = employeeService;
        this.timeRecordService = timeRecordService;
    }

    @PostMapping("/fichajes")
    public TimeRecord createRecord(@RequestBody Map<String, String> body,
                                   Authentication auth,
                                   HttpServletRequest request) {
        Employee empleado = employeeService.findByEmail(auth.getName()).orElseThrow();
        RecordType tipo = RecordType.valueOf(body.get("tipo"));
        LocalDateTime hora = LocalDateTime.now();
        return timeRecordService.recordEvent(
                empleado,
                tipo,
                hora,
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
        );
    }

    @GetMapping("/fichajes/mis-registros")
    public List<TimeRecord> myRecords(Authentication auth) {
        Employee empleado = employeeService.findByEmail(auth.getName()).orElseThrow();
        return timeRecordService.findByEmployee(empleado);
    }


    @GetMapping("/fichajes/mis-jornadas")
    public List<JornadaResumenDto> misJornadas(
            Authentication auth,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        Employee empleado = employeeService.findByEmail(auth.getName()).orElseThrow();

        LocalDate hoy = LocalDate.now();
        LocalDate s = (start != null) ? start : hoy.minusDays(30);
        LocalDate e = (end != null) ? end : hoy;

        return timeRecordService.getResumenJornadas(empleado, s, e);
    }

}