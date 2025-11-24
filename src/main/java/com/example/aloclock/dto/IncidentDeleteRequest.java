package com.example.aloclock.dto;

public class IncidentDeleteRequest {
    private Long timeRecordId;
    private String comentario;

    public Long getTimeRecordId() {
        return timeRecordId;
    }

    public void setTimeRecordId(Long timeRecordId) {
        this.timeRecordId = timeRecordId;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
