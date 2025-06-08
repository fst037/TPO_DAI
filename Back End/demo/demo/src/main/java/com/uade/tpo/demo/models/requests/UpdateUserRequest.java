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
@Schema(description = "Solicitud para registrar un nuevo usuario")
public class UpdateUserRequest {
  @Schema(
      description = "Apodo del usuario",
      example = "user123",
      required = true
  )
  private String nickname;

  @Schema(
      description = "Nombre completo del usuario",
      example = "John Doe",
      required = true
  )
  private String nombre;

  @Schema(
      description = "Dirección del usuario",
      example = "123 Main St, Springfield",
      required = true
  )
  private String direccion;

  @Schema(
      description = "URL de la imagen del avatar del usuario",
      example = "https://example.com/avatar.jpg",
      required = true
  )
  private String avatar;
}
