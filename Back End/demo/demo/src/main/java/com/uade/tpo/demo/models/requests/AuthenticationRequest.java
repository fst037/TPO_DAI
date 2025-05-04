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
@Schema(description = "Solicitud para la autenticación de un usuario")
public class AuthenticationRequest {

  @Schema(description = "Correo electrónico del usuario", example = "usuario@ejemplo.com", required = true)
  String email;

  @Schema(description = "Contraseña del usuario", example = "contraseña123", required = true)
  String password;
}
