package com.example.aloclock.controller;

import com.example.aloclock.model.Employee;
import com.example.aloclock.model.RecordType;
import com.example.aloclock.model.TimeRecord;
import com.example.aloclock.service.EmployeeService;
import com.example.aloclock.service.TimeRecordService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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
    public TimeRecord createRecord(@RequestBody Map<String, String> body, Authentication auth, HttpServletRequest request) {
        Employee empleado = employeeService.findByEmail(auth.getName()).orElseThrow();
        RecordType tipo = RecordType.valueOf(body.get("tipo"));
        LocalDateTime hora = LocalDateTime.now();
        return timeRecordService.recordEvent(empleado, tipo, hora, request.getRemoteAddr(), request.getHeader("User-Agent"));
    }

    @GetMapping("/fichajes/mis-registros")
    public List<TimeRecord> myRecords(Authentication auth) {
        Employee empleado = employeeService.findByEmail(auth.getName()).orElseThrow();
        return timeRecordService.findByEmployee(empleado);
    }
}