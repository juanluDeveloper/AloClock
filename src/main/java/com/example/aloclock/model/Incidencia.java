// Incidencia.java
package com.example.aloclock.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.aloclock.model.enums.IncidentStatus;
import com.example.aloclock.model.enums.IncidentType;
import com.example.aloclock.model.enums.RecordType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

@Entity
public class Incidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Employee empleado;    // quien reporta

    @Enumerated(EnumType.STRING)
    private IncidentType tipo;

    @Enumerated(EnumType.STRING)
    private IncidentStatus estado = IncidentStatus.PENDIENTE;

    @Enumerated(EnumType.STRING)
    private RecordType recordType;    // tipo de fichaje implicado (ENTRADA, SALIDA, etc.)

    private LocalDate fechaObjetivo;          // día afectado
    private LocalDateTime instanteObjetivo;   // hora que se pide (para ADD)

    private Long timeRecordIdAfectado;        // si se elimina o corrige uno existente

    @Column(length = 1000)
    private String comentarioUsuario;

    @Column(length = 1000)
    private String comentarioAdmin;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String resueltoPor;    // email del admin

    public Incidencia() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = IncidentStatus.PENDIENTE;
        }
    }

    // getters y setters

    public Long getId() {
        return id;
    }

    public Employee getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Employee empleado) {
        this.empleado = empleado;
    }

    public IncidentType getTipo() {
        return tipo;
    }

    public void setTipo(IncidentType tipo) {
        this.tipo = tipo;
    }

    public IncidentStatus getEstado() {
        return estado;
    }

    public void setEstado(IncidentStatus estado) {
        this.estado = estado;
    }

    public RecordType getRecordType() {
        return recordType;
    }

    public void setRecordType(RecordType recordType) {
        this.recordType = recordType;
    }

    public LocalDate getFechaObjetivo() {
        return fechaObjetivo;
    }

    public void setFechaObjetivo(LocalDate fechaObjetivo) {
        this.fechaObjetivo = fechaObjetivo;
    }

    public LocalDateTime getInstanteObjetivo() {
        return instanteObjetivo;
    }

    public void setInstanteObjetivo(LocalDateTime instanteObjetivo) {
        this.instanteObjetivo = instanteObjetivo;
    }

    public Long getTimeRecordIdAfectado() {
        return timeRecordIdAfectado;
    }

    public void setTimeRecordIdAfectado(Long timeRecordIdAfectado) {
        this.timeRecordIdAfectado = timeRecordIdAfectado;
    }

    public String getComentarioUsuario() {
        return comentarioUsuario;
    }

    public void setComentarioUsuario(String comentarioUsuario) {
        this.comentarioUsuario = comentarioUsuario;
    }

    public String getComentarioAdmin() {
        return comentarioAdmin;
    }

    public void setComentarioAdmin(String comentarioAdmin) {
        this.comentarioAdmin = comentarioAdmin;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResueltoPor() {
        return resueltoPor;
    }

    public void setResueltoPor(String resueltoPor) {
        this.resueltoPor = resueltoPor;
    }
}
