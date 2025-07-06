package com.uade.tpo.demo.service.interfaces;

import com.uade.tpo.demo.exceptions.CardValidationException;
import java.io.IOException;
import java.util.Map;

public interface ICardValidationService {
    /**
     * Valida una tarjeta de crédito/débito y guarda el token en el usuario.
     * 
     * @param body Map con datos de la tarjeta
     * @return String con mensaje de éxito
     * @throws CardValidationException si hay error en la validación
     * @throws IOException si hay error en la comunicación
     * @throws InterruptedException si la operación es interrumpida
     */
    String validarYGuardarTarjeta(Map<String, String> body) throws CardValidationException, IOException, InterruptedException;
}
