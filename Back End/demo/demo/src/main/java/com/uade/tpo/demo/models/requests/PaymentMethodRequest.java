package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Solicitud para actualizar un método de pago")
public class PaymentMethodRequest {

  @Schema(description = "Número de tarjeta del alumno", example = "1234-5678-9012-3456", required = true)
  private String cardNumber;

  @Schema(description = "Nombre del titular de la tarjeta", example = "Juan Perez", required = true)
  private String cardName;

  @Schema(description = "Fecha de vencimiento de la tarjeta", example = "12/25", required = true)
  private String cardExpiry;

  @Schema(description = "Código de seguridad de la tarjeta", example = "123", required = true)
  private String cardCvv;
}
