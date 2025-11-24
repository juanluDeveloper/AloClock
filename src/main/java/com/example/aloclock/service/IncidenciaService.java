package com.example.aloclock.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.aloclock.model.Employee;
import com.example.aloclock.model.Incidencia;
import com.example.aloclock.model.TimeRecord;
import com.example.aloclock.model.enums.IncidentStatus;
import com.example.aloclock.model.enums.IncidentType;
import com.example.aloclock.model.enums.RecordType;
import com.example.aloclock.repository.IncidenciaRepository;
import com.example.aloclock.repository.TimeRecordRepository;

@Service
public class IncidenciaService {

    private final IncidenciaRepository incidenciaRepository;
    private final TimeRecordRepository timeRecordRepository;

    public IncidenciaService(IncidenciaRepository incidenciaRepository,
                             TimeRecordRepository timeRecordRepository) {
        this.incidenciaRepository = incidenciaRepository;
        this.timeRecordRepository = timeRecordRepository;
    }

    // ----- PARTE USUARIO -----

    public Incidencia crearIncidenciaAdd(Employee empleado,
                                         RecordType recordType,
                                         LocalDate fecha,
                                         LocalTime hora,
                                         String comentarioUsuario) {
        Incidencia inc = new Incidencia();
        inc.setEmpleado(empleado);
        inc.setTipo(IncidentType.ADD);
        inc.setRecordType(recordType);
        inc.setFechaObjetivo(fecha);
        if (fecha != null && hora != null) {
            inc.setInstanteObjetivo(LocalDateTime.of(fecha, hora));
        }
        inc.setComentarioUsuario(comentarioUsuario);
        return incidenciaRepository.save(inc);
    }

    public Incidencia crearIncidenciaDelete(Employee empleado,
                                            Long timeRecordId,
                                            String comentarioUsuario) {
        Incidencia inc = new Incidencia();
        inc.setEmpleado(empleado);
        inc.setTipo(IncidentType.DELETE);
        inc.setTimeRecordIdAfectado(timeRecordId);
        inc.setComentarioUsuario(comentarioUsuario);
        return incidenciaRepository.save(inc);
    }

    public List<Incidencia> misIncidencias(Employee empleado) {
        return incidenciaRepository.findByEmpleadoOrderByCreatedAtDesc(empleado);
    }

    // ----- PARTE ADMIN -----

    public List<Incidencia> listarTodas(IncidentStatus estado) {
        if (estado != null) {
            return incidenciaRepository.findByEstadoOrderByCreatedAtDesc(estado);
        }
        return incidenciaRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Incidencia aprobarIncidencia(Long incidenciaId, String adminEmail) {
        Incidencia inc = incidenciaRepository.findById(incidenciaId).orElseThrow();

        if (inc.getEstado() != IncidentStatus.PENDIENTE) {
            throw new IllegalStateException("La incidencia ya está resuelta");
        }

        switch (inc.getTipo()) {
            case ADD -> aplicarAdd(inc, adminEmail);
            case DELETE -> aplicarDelete(inc, adminEmail);
            case EDIT -> aplicarEdit(inc, adminEmail);   // 👈
        }

        inc.setEstado(IncidentStatus.APROBADA);
        inc.setResueltoPor(adminEmail);
        inc.setResolvedAt(LocalDateTime.now());

        return incidenciaRepository.save(inc);
    }

    @Transactional
    public Incidencia rechazarIncidencia(Long incidenciaId,
                                         String adminEmail,
                                         String comentarioAdmin) {
        Incidencia inc = incidenciaRepository.findById(incidenciaId).orElseThrow();

        if (inc.getEstado() != IncidentStatus.PENDIENTE) {
            throw new IllegalStateException("La incidencia ya está resuelta");
        }

        inc.setEstado(IncidentStatus.RECHAZADA);
        inc.setResueltoPor(adminEmail);
        inc.setResolvedAt(LocalDateTime.now());
        inc.setComentarioAdmin(comentarioAdmin);

        return incidenciaRepository.save(inc);
    }

    public Incidencia crearIncidenciaEdit(Employee empleado,
                                      Long timeRecordId,
                                      LocalDate fecha,
                                      LocalTime hora,
                                      String comentarioUsuario) {
        Incidencia inc = new Incidencia();
        inc.setEmpleado(empleado);
        inc.setTipo(IncidentType.EDIT);
        inc.setTimeRecordIdAfectado(timeRecordId);
        inc.setFechaObjetivo(fecha);
        if (fecha != null && hora != null) {
            inc.setInstanteObjetivo(LocalDateTime.of(fecha, hora));
        }
        inc.setComentarioUsuario(comentarioUsuario);
        return incidenciaRepository.save(inc);
    }

    // ----- LÓGICA DE APLICACIÓN -----

    private void aplicarAdd(Incidencia inc, String adminEmail) {
        if (inc.getFechaObjetivo() == null || inc.getInstanteObjetivo() == null || inc.getRecordType() == null) {
            throw new IllegalStateException("Incidencia ADD incompleta");
        }

        // Creamos un nuevo fichaje usando el constructor nuevo
        TimeRecord record = new TimeRecord(
                inc.getEmpleado(),
                inc.getInstanteObjetivo(),
                inc.getRecordType(),
                "INCIDENCIA",    // ipOrigen simbólica
                "AJUSTE_MANUAL"  // userAgent simbólico
        );

        record.setIncidenciaId(inc.getId());
        // eliminado = false viene por defecto en el constructor

        timeRecordRepository.save(record);
    }

    private void aplicarDelete(Incidencia inc, String adminEmail) {
        if (inc.getTimeRecordIdAfectado() == null) {
            throw new IllegalStateException("Incidencia DELETE sin registro asociado");
        }

        TimeRecord record = timeRecordRepository.findById(inc.getTimeRecordIdAfectado())
                .orElseThrow();

        record.setEliminado(true);
        record.setEliminadoEn(LocalDateTime.now());
        record.setEliminadoPor(adminEmail);
        record.setIncidenciaId(inc.getId());

        timeRecordRepository.save(record);
    }

    private void aplicarEdit(Incidencia inc, String adminEmail) {
        if (inc.getTimeRecordIdAfectado() == null
                || inc.getFechaObjetivo() == null
                || inc.getInstanteObjetivo() == null) {
            throw new IllegalStateException("Incidencia EDIT incompleta");
        }

        TimeRecord record = timeRecordRepository.findById(inc.getTimeRecordIdAfectado())
                .orElseThrow();

        // Actualizamos fecha e instante
        record.setFecha(inc.getFechaObjetivo());
        record.setInstante(inc.getInstanteObjetivo());
        record.setIncidenciaId(inc.getId());

        // opcional: marcar quién tocó el registro
        record.setEliminado(false); // por si acaso
        record.setEliminadoEn(null);
        record.setEliminadoPor(null);

        timeRecordRepository.save(record);
    }
}
