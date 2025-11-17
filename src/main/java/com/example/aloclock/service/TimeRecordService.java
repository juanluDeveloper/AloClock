package com.example.aloclock.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.aloclock.dto.JornadaResumenDto;
import com.example.aloclock.model.Employee;
import com.example.aloclock.model.TimeRecord;
import com.example.aloclock.model.enums.RecordType;
import com.example.aloclock.repository.TimeRecordRepository;

@Service
public class TimeRecordService {
    private final TimeRecordRepository repository;

    public TimeRecordService(TimeRecordRepository repository) {
        this.repository = repository;
    }

    public TimeRecord recordEvent(Employee empleado, RecordType tipo, LocalDateTime hora,
                                  String ip, String userAgent) {

        TimeRecord ultimo = repository
                .findTopByEmpleadoOrderByInstanteDesc(empleado)
                .orElse(null);

        // Reglas básicas de estado
        switch (tipo) {
            case ENTRADA -> {
                if (ultimo != null &&
                        (ultimo.getTipo() == RecordType.ENTRADA
                                || ultimo.getTipo() == RecordType.REANUDACION)) {
                    throw new IllegalStateException("No puede fichar ENTRADA si ya está trabajando.");
                }
            }
            case SALIDA -> {
                if (ultimo == null ||
                        ultimo.getTipo() == RecordType.SALIDA ||
                        ultimo.getTipo() == RecordType.PAUSA) {
                    throw new IllegalStateException("No puede fichar SALIDA si no ha entrado.");
                }
            }
            case PAUSA -> {
                if (ultimo == null ||
                        ultimo.getTipo() == RecordType.SALIDA ||
                        ultimo.getTipo() == RecordType.PAUSA) {
                    throw new IllegalStateException("No puede iniciar PAUSA si no está trabajando.");
                }
            }
            case REANUDACION -> {
                if (ultimo == null ||
                        ultimo.getTipo() != RecordType.PAUSA) {
                    throw new IllegalStateException("Solo puede reanudar tras una PAUSA.");
                }
            }
        }

        TimeRecord record = new TimeRecord(
                empleado,
                hora.toLocalDate(),
                hora,
                tipo,
                LocalDateTime.now(),
                ip,
                userAgent
        );
        return repository.save(record);
    }

    public List<TimeRecord> findByEmployee(Employee empleado) {
        return repository.findByEmpleado(empleado);
    }

    public List<TimeRecord> findByEmployeeAndDateRange(Employee empleado, LocalDate start, LocalDate end) {
        return repository.findByEmpleadoAndFechaBetween(empleado, start, end);
    }


    public List<JornadaResumenDto> getResumenJornadas(Employee empleado,
                                                      LocalDate start,
                                                      LocalDate end) {

        List<TimeRecord> records = repository.findByEmpleadoAndFechaBetween(empleado, start, end);

        // Agrupamos por fecha
        Map<LocalDate, List<TimeRecord>> porFecha = records.stream()
                .collect(Collectors.groupingBy(TimeRecord::getFecha));

        return porFecha.entrySet().stream()
                .map(entry -> {
                    LocalDate fecha = entry.getKey();
                    List<TimeRecord> eventos = entry.getValue().stream()
                            .sorted((a, b) -> a.getInstante().compareTo(b.getInstante()))
                            .toList();

                    // Primera entrada (ENTRADA o REANUDACION)
                    LocalDateTime primeraEntrada = eventos.stream()
                            .filter(e -> e.getTipo() == RecordType.ENTRADA
                                      || e.getTipo() == RecordType.REANUDACION)
                            .map(TimeRecord::getInstante)
                            .findFirst()
                            .orElse(null);

                    // Última salida
                    LocalDateTime ultimaSalida = eventos.stream()
                            .filter(e -> e.getTipo() == RecordType.SALIDA)
                            .map(TimeRecord::getInstante)
                            .reduce((a, b) -> b)
                            .orElse(null);

                    // Cálculo de minutos trabajados
                    long minutosTrabajados = calcularMinutosTrabajados(eventos);

                    return new JornadaResumenDto(
                            fecha,
                            primeraEntrada,
                            ultimaSalida,
                            minutosTrabajados
                    );
                })
                // ordenamos por fecha
                .sorted((a, b) -> a.getFecha().compareTo(b.getFecha()))
                .toList();
    }

    private long calcularMinutosTrabajados(List<TimeRecord> eventosOrdenados) {
        boolean trabajando = false;
        LocalDateTime inicioTramo = null;
        long totalMinutos = 0;

        for (TimeRecord e : eventosOrdenados) {
            switch (e.getTipo()) {
                case ENTRADA, REANUDACION -> {
                    if (!trabajando) {
                        trabajando = true;
                        inicioTramo = e.getInstante();
                    }
                }
                case PAUSA, SALIDA -> {
                    if (trabajando && inicioTramo != null) {
                        totalMinutos += Duration.between(inicioTramo, e.getInstante()).toMinutes();
                        trabajando = false;
                        inicioTramo = null;
                    }
                }
            }
        }

        // Si se quedó "trabajando" sin salida ni pausa:
        // podríamos sumar hasta ahora si es hoy; de momento no lo hacemos.
        return totalMinutos;
    }
}