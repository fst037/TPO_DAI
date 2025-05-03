package com.uade.tpo.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.exceptions.ExistingUserException;
import com.uade.tpo.demo.models.requests.AuthenticationRequest;
import com.uade.tpo.demo.models.requests.RegisterRequest;
import com.uade.tpo.demo.models.requests.RequestInitialRegisterRequest;
import com.uade.tpo.demo.models.requests.ResetPasswordRequest;
import com.uade.tpo.demo.models.responses.AuthenticationResponse;
import com.uade.tpo.demo.service.AuthenticationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService authService;

  @PostMapping("/requestInitialRegister")
  @Operation(
      summary = "Request initial registration",
      description = "Sends an initial registration request for a new user."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Registration request successful"),
      @ApiResponse(responseCode = "500", description = "Internal server error")
  })
  public ResponseEntity<Object> requestInitialRegister(
      @RequestBody(description = "Details for the initial registration request", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RequestInitialRegisterRequest.class)
          )
      ) RequestInitialRegisterRequest request) throws ExistingUserException {
    try {
      return ResponseEntity.ok(authService.requestInitialRegister(request));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  
  @PostMapping("/register")
  @Operation(
      summary = "Register a new user",
      description = "Registers a new user in the system."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "User registered successfully",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = AuthenticationResponse.class)
          )),
      @ApiResponse(responseCode = "500", description = "Internal server error")
  })
  public ResponseEntity<AuthenticationResponse> register(
      @RequestBody(description = "Details of the user to register", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RegisterRequest.class)
          )
      ) RegisterRequest request) throws ExistingUserException {
    return ResponseEntity.ok(authService.register(request));
  }

  @PostMapping("/authenticate")
  @Operation(
      summary = "Authenticate a user",
      description = "Authenticates a user and returns a token if the credentials are valid."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Authentication successful",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = AuthenticationResponse.class)
          )),
      @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid credentials",
          content = @Content(
              mediaType = "application/json"
          )),
      @ApiResponse(responseCode = "500", description = "Internal server error")
  })
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody(description = "User credentials for authentication", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = AuthenticationRequest.class)
          )
      ) AuthenticationRequest request) {
    return ResponseEntity.ok(authService.authenticate(request));
  }

  @PostMapping("/recoverPassword")
  @Operation(
      summary = "Recover password",
      description = "Sends a password recovery email to the user."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Password recovery email sent successfully"),
      @ApiResponse(responseCode = "500", description = "Internal server error")
  })
  public ResponseEntity<String> recoverPassword(
    @RequestBody(description = "Email address of the user requesting password recovery", required = true,
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(example = "{\"email\": \"user@example.com\"}")
        )
    ) String email) {
    try {
      return ResponseEntity.ok(authService.recoverPassword(email));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/resetPassword")
  @Operation(
      summary = "Reset password",
      description = "Resets the user's password using a verification code."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Password reset successfully"),
      @ApiResponse(responseCode = "400", description = "Bad request - Invalid input",
          content = @Content(
              mediaType = "application/json"
          )),
      @ApiResponse(responseCode = "500", description = "Internal server error")
  })
  public ResponseEntity<String> resetPassword(
    @RequestBody(description = "Details for resetting the password", required = true,
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ResetPasswordRequest.class)
        )
    ) ResetPasswordRequest request) throws ExistingUserException {
    try {
      return ResponseEntity.ok(authService.resetPassword(request.getEmail(), request.getVerificationCode(), request.getPassword()));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}