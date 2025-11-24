package com.example.aloclock.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.example.aloclock.model.enums.RecordType;

public class IncidentAddRequest {
    private RecordType recordType;
    private LocalDate fecha;
    private LocalTime hora;
    private String comentario;

    public RecordType getRecordType() {
        return recordType;
    }

    public void setRecordType(RecordType recordType) {
        this.recordType = recordType;
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
