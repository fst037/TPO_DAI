package com.uade.tpo.demo.service.interfaces;

import com.uade.tpo.demo.exceptions.CardValidationException;
import java.io.IOException;
import java.util.Map;

public interface ICardValidationService {

    String validarYGuardarTarjeta(Map<String, String> body) throws CardValidationException, IOException, InterruptedException;
    
    int parseExpirationMonth(String cardExpiry) throws CardValidationException;

    int parseExpirationYear(String cardExpiry) throws CardValidationException;
}
