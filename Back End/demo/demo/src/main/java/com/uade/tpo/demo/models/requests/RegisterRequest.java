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
public class RegisterRequest {

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

  @Schema(
      description = "Contraseña del usuario",
      example = "securePassword123",
      required = true
  )
  private String password;

  @Schema(
      description = "Código de verificación enviado al correo electrónico del usuario",
      example = "123456",
      required = true
  )
  private String verificationCode;
}