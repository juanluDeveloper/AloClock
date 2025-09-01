package com.example.aloclock.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class TimeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Employee empleado;

    private LocalDate fecha;

    private LocalDateTime horaEntrada;

    private LocalDateTime horaSalida;

    @Enumerated(EnumType.STRING)
    private RecordType tipo;

    private LocalDateTime creadoEn;

    private String ipOrigen;

    private String userAgent;

    public TimeRecord() {}

    public TimeRecord(Employee empleado, LocalDate fecha, LocalDateTime horaEntrada, LocalDateTime horaSalida,
                      RecordType tipo, LocalDateTime creadoEn, String ipOrigen, String userAgent) {
        this.empleado = empleado;
        this.fecha = fecha;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
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

    public LocalDateTime getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(LocalDateTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public LocalDateTime getHoraSalida() {
        return horaSalida;
    }

    public void setHoraSalida(LocalDateTime horaSalida) {
        this.horaSalida = horaSalida;
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
