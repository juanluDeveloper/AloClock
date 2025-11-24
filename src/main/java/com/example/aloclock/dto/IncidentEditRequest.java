package com.example.aloclock.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class IncidentEditRequest {

    private Long timeRecordId;
    private LocalDate fecha;
    private LocalTime hora;
    private String comentario;

    public Long getTimeRecordId() {
        return timeRecordId;
    }

    public void setTimeRecordId(Long timeRecordId) {
        this.timeRecordId = timeRecordId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
