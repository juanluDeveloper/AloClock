package com.example.aloclock.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.aloclock.model.enums.RecordType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class TimeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Employee empleado;

    private LocalDate fecha;

    private LocalDateTime instante;

    @Enumerated(EnumType.STRING)
    private RecordType tipo;

    private LocalDateTime createdAt;

    private String ip;

    private String userAgent;

    private boolean eliminado = false;

    // nuevos campos para trazabilidad / borrado lógico
    private LocalDateTime eliminadoEn;

    private String eliminadoPor;

    private Long incidenciaId;

    // Constructor completo original
    public TimeRecord(Employee empleado,
                      LocalDate fecha,
                      LocalDateTime instante,
                      RecordType tipo,
                      LocalDateTime createdAt,
                      String ip,
                      String userAgent) {

        this.empleado = empleado;
        this.fecha = fecha;
        this.instante = instante;
        this.tipo = tipo;
        this.createdAt = createdAt;
        this.ip = ip;
        this.userAgent = userAgent;
        this.eliminado = false;
    }

    // Segundo constructor simplificado (el que usas en IncidenciaService)
    public TimeRecord(Employee empleado,
                      LocalDateTime instante,
                      RecordType tipo,
                      String ip,
                      String userAgent) {

        this.empleado = empleado;
        this.fecha = instante != null ? instante.toLocalDate() : null;
        this.instante = instante;
        this.tipo = tipo;
        this.createdAt = LocalDateTime.now();
        this.ip = ip;
        this.userAgent = userAgent;
        this.eliminado = false;
    }

    // Constructor vacío requerido por JPA
    public TimeRecord() {}

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public Employee getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Employee empleado) {
        this.empleado = empleado;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalDateTime getInstante() {
        return instante;
    }

    public void setInstante(LocalDateTime instante) {
        this.instante = instante;
    }

    public RecordType getTipo() {
        return tipo;
    }

    public void setTipo(RecordType tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public boolean isEliminado() {
        return eliminado;
    }

    public void setEliminado(boolean eliminado) {
        this.eliminado = eliminado;
    }

    public LocalDateTime getEliminadoEn() {
        return eliminadoEn;
    }

    public void setEliminadoEn(LocalDateTime eliminadoEn) {
        this.eliminadoEn = eliminadoEn;
    }

    public String getEliminadoPor() {
        return eliminadoPor;
    }

    public void setEliminadoPor(String eliminadoPor) {
        this.eliminadoPor = eliminadoPor;
    }

    public Long getIncidenciaId() {
        return incidenciaId;
    }

    public void setIncidenciaId(Long incidenciaId) {
        this.incidenciaId = incidenciaId;
    }
}
