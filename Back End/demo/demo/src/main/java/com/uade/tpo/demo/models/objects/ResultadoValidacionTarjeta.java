package com.uade.tpo.demo.models.objects;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultadoValidacionTarjeta {
    private boolean exito;
    private String mensaje;
    
    public static ResultadoValidacionTarjeta ok(String mensaje) {
        return new ResultadoValidacionTarjeta(true, mensaje);
    }
    
    public static ResultadoValidacionTarjeta error(String mensaje) {
        return new ResultadoValidacionTarjeta(false, mensaje);
    }
}
