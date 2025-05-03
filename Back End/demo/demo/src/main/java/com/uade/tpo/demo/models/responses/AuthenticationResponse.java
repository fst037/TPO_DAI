package com.uade.tpo.demo.models.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Objeto de respuesta que contiene el token de autenticación.")
public class AuthenticationResponse {

  @JsonProperty("access_token")
  @Schema(description = "Token de acceso generado tras la autenticación", example = "eyJhbGciOiJIUzI1...")
  private String accessToken;

}
