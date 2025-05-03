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
@Schema(description = "Request to register a new user")
public class RegisterRequest {

  @Schema(
      description = "Email address of the user",
      example = "user@example.com",
      required = true
  )
  private String email;

  @Schema(
      description = "Nickname of the user",
      example = "user123",
      required = true
  )
  private String nickname;

  @Schema(
      description = "Full name of the user",
      example = "John Doe",
      required = true
  )
  private String nombre;

  @Schema(
      description = "Address of the user",
      example = "123 Main St, Springfield",
      required = true
  )
  private String direccion;

  @Schema(
      description = "URL of the user's avatar image",
      example = "https://example.com/avatar.jpg",
      required = true
  )
  private String avatar;

  @Schema(
      description = "Password for the user",
      example = "securePassword123",
      required = true
  )
  private String password;

  @Schema(
      description = "Verification code sent to the user's email",
      example = "123456",
      required = true
  )
  private String verificationCode;
}