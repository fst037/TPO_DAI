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
@Schema(description = "Solicitud para iniciar el proceso de registro de un nuevo usuario")
public class RequestInitialRegisterRequest {

  @Schema(
      description = "Dirección de correo electrónico del usuario",
      example = "user@example.com",
      required = true
  )
  private String email;

  @Schema(
      description = "Apodo del usuario",
      example = "user123",
      required = true
  )
  private String nickname;
}