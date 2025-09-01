package com.example.aloclock.service;

import com.example.aloclock.model.Employee;
import com.example.aloclock.model.RecordType;
import com.example.aloclock.model.TimeRecord;
import com.example.aloclock.repository.TimeRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TimeRecordService {
    private final TimeRecordRepository repository;

    public TimeRecordService(TimeRecordRepository repository) {
        this.repository = repository;
    }

    public TimeRecord recordEvent(Employee empleado, RecordType tipo, LocalDateTime hora, String ip, String userAgent) {
        TimeRecord record = new TimeRecord(empleado, hora.toLocalDate(),
                tipo == RecordType.SALIDA ? null : hora,
                tipo == RecordType.SALIDA ? hora : null,
                tipo, LocalDateTime.now(), ip, userAgent);
        return repository.save(record);
    }

    public List<TimeRecord> findByEmployee(Employee empleado) {
        return repository.findByEmpleado(empleado);
    }

    public List<TimeRecord> findByEmployeeAndDateRange(Employee empleado, LocalDate start, LocalDate end) {
        return repository.findByEmpleadoAndFechaBetween(empleado, start, end);
    }
}
