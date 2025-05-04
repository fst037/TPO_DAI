package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para registrar o actualizar un estudiante")
public class StudentRequest {

  @Schema(description = "Número de tarjeta del estudiante", example = "1234-5678-9012-3456", required = true)
  private String cardNumber;

  @Schema(description = "Imagen del frente del DNI", example = "https://example.com/dni-front.jpg", required = true)
  private String dniFront;

  @Schema(description = "Imagen del dorso del DNI", example = "https://example.com/dni-back.jpg", required = true)
  private String dniBack;

  @Schema(description = "Número de trámite del DNI", example = "123456789", required = true)
  private String procedureNumber;
}
