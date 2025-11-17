package com.example.aloclock.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class JornadaResumenDto {

    private LocalDate fecha;
    private LocalDateTime primeraEntrada;
    private LocalDateTime ultimaSalida;
    private long minutosTrabajados;

    public JornadaResumenDto(LocalDate fecha,
                             LocalDateTime primeraEntrada,
                             LocalDateTime ultimaSalida,
                             long minutosTrabajados) {
        this.fecha = fecha;
        this.primeraEntrada = primeraEntrada;
        this.ultimaSalida = ultimaSalida;
        this.minutosTrabajados = minutosTrabajados;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public LocalDateTime getPrimeraEntrada() {
        return primeraEntrada;
    }

    public LocalDateTime getUltimaSalida() {
        return ultimaSalida;
    }

    public long getMinutosTrabajados() {
        return minutosTrabajados;
    }
}
