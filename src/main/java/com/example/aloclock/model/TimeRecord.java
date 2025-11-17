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

    @ManyToOne(optional = false)
    private Employee empleado;

    private LocalDate fecha;              // Día del evento

    private LocalDateTime instante;       // Momento exacto del evento

    @Enumerated(EnumType.STRING)
    private RecordType tipo;              // ENTRADA, SALIDA, PAUSA, REANUDACION

    private LocalDateTime creadoEn;

    private String ipOrigen;

    private String userAgent;

    public TimeRecord() {}

    public TimeRecord(Employee empleado,
                      LocalDate fecha,
                      LocalDateTime instante,
                      RecordType tipo,
                      LocalDateTime creadoEn,
                      String ipOrigen,
                      String userAgent) {
        this.empleado = empleado;
        this.fecha = fecha;
        this.instante = instante;
        this.tipo = tipo;
        this.creadoEn = creadoEn;
        this.ipOrigen = ipOrigen;
        this.userAgent = userAgent;
    }

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

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(LocalDateTime creadoEn) {
        this.creadoEn = creadoEn;
    }

    public String getIpOrigen() {
        return ipOrigen;
    }

    public void setIpOrigen(String ipOrigen) {
        this.ipOrigen = ipOrigen;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
}