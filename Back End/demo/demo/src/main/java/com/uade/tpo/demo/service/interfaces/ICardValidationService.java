package com.uade.tpo.demo.service.interfaces;

import com.uade.tpo.demo.models.objects.ResultadoValidacionTarjeta;
import java.io.IOException;
import java.util.Map;

public interface ICardValidationService {
    ResultadoValidacionTarjeta validarYGuardarTarjeta(Map<String, String> body) throws IOException, InterruptedException;
}
