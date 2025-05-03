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
@Schema(description = "Request to initiate the registration process for a new user")
public class RequestInitialRegisterRequest {

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
}