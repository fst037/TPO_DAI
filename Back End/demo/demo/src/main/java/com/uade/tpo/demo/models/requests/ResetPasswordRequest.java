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
public class ResetPasswordRequest {
  @Schema(description = "La dirección de correo electrónico del usuario", example = "user@example.com", required = true)
  private String email;

  @Schema(description = "El código de verificación enviado al usuario", example = "123456", required = true)
  private String verificationCode;

  @Schema(description = "La nueva contraseña para el usuario", example = "P@ssw0rd!", required = true)
  private String password;
}
