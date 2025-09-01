package com.example.aloclock.controller;

import com.example.aloclock.model.Employee;
import com.example.aloclock.model.TimeRecord;
import com.example.aloclock.model.Role;
import com.example.aloclock.service.EmployeeService;
import com.example.aloclock.service.TimeRecordService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final EmployeeService employeeService;
    private final TimeRecordService timeRecordService;

    public AdminController(EmployeeService employeeService, TimeRecordService timeRecordService) {
        this.employeeService = employeeService;
        this.timeRecordService = timeRecordService;
    }

    @GetMapping("/fichajes")
    public List<TimeRecord> getRecords(@RequestParam(required = false) Long empleadoId,
                                       @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
                                       @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        LocalDate s = start == null ? LocalDate.MIN : start;
        LocalDate e = end == null ? LocalDate.MAX : end;
        if (empleadoId != null) {
            Employee emp = employeeService.findAll().stream().filter(x -> x.getId().equals(empleadoId)).findFirst().orElseThrow();
            return timeRecordService.findByEmployeeAndDateRange(emp, s, e);
        }
        return employeeService.findAll().stream()
                .flatMap(emp -> timeRecordService.findByEmployeeAndDateRange(emp, s, e).stream())
                .collect(Collectors.toList());
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<TimeRecord> records = getRecords(null, start, end);
        String csv = records.stream()
                .map(r -> String.join(",",
                        r.getEmpleado().getNombre(),
                        r.getFecha().toString(),
                        r.getHoraEntrada() != null ? r.getHoraEntrada().toString() : "",
                        r.getHoraSalida() != null ? r.getHoraSalida().toString() : "",
                        r.getTipo().name()))
                .collect(Collectors.joining("\n"));
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=export.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(bytes);
    }

    @PostMapping("/empleados")
    public Employee createEmployee(@RequestBody Map<String, String> body) {
        return employeeService.createEmployee(body.get("nombre"), body.get("email"), body.get("password"),
                Role.valueOf(body.getOrDefault("rol", "USER")));
    }

    @PutMapping("/empleados/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Employee emp = employeeService.findAll().stream().filter(e -> e.getId().equals(id)).findFirst().orElseThrow();
        if (body.containsKey("nombre")) emp.setNombre((String) body.get("nombre"));
        if (body.containsKey("activo")) emp.setActivo((Boolean) body.get("activo"));
        return employeeService.save(emp);
    }
}
