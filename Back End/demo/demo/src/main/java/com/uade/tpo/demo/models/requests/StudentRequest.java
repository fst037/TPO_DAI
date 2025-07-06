package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para registrar o actualizar un alumno")
public class StudentRequest {

  @Schema(description = "Número de tarjeta del alumno", example = "1234-5678-9012-3456", required = true)
  private String cardNumber;

  @Schema(description = "Nombre del titular de la tarjeta", example = "Juan Perez", required = true)
  private String cardName;

  @Schema(description = "Fecha de vencimiento de la tarjeta", example = "12/25", required = true)
  private String cardExpiry;

  @Schema(description = "Código de seguridad de la tarjeta", example = "123", required = true)
  private String cardCvv;

  @Schema(description = "Imagen del frente del DNI", example = "https://example.com/dni-front.jpg", required = true)
  private String dniFront;

  @Schema(description = "Imagen del dorso del DNI", example = "https://example.com/dni-back.jpg", required = true)
  private String dniBack;

  @Schema(description = "Número de trámite del DNI", example = "123456789", required = true)
  private String procedureNumber;

  @Schema(description = "Número de DNI del titular", example = "12345678", required = true)
  private String dni;
}