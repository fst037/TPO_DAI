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
@Schema(description = "Request to reset the user's password")
public class ResetPasswordRequest {
  @Schema(description = "The email address of the user", example = "user@example.com", required = true)
  private String email;

  @Schema(description = "The verification code sent to the user", example = "123456", required = true)
  private String verificationCode;

  @Schema(description = "The new password for the user", example = "P@ssw0rd!", required = true)
  private String password;
}
