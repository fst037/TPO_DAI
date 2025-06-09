package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para restablecer la contraseña del usuario")
public class RecoverPasswordRequest {
  @Schema(description = "La dirección de correo electrónico del usuario", example = "user@example.com", required = true)
  private String email;
}
