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
@Tag(name = "Autenticación", description = "Endpoints para la autenticación y registro de usuarios")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService authService;

  @PostMapping("/requestInitialRegister")
  @Operation(
      summary = "Solicitar registro inicial",
      description = "Envía una solicitud de registro inicial para un nuevo usuario."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Solicitud de registro exitosa"),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor")
  })
  public ResponseEntity<Object> requestInitialRegister(
      @RequestBody(description = "Detalles para la solicitud de registro inicial", required = true,
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
      summary = "Registrar un nuevo usuario",
      description = "Registra un nuevo usuario en el sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Usuario registrado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = AuthenticationResponse.class)
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor")
  })
  public ResponseEntity<AuthenticationResponse> register(
      @RequestBody(description = "Detalles del usuario a registrar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RegisterRequest.class)
          )
      ) RegisterRequest request) throws ExistingUserException {
    return ResponseEntity.ok(authService.register(request));
  }

  @PostMapping("/authenticate")
  @Operation(
      summary = "Autenticar un usuario",
      description = "Autentica un usuario y devuelve un token si las credenciales son válidas."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Autenticación exitosa",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = AuthenticationResponse.class)
          )),
      @ApiResponse(responseCode = "401", description = "No autorizado - Credenciales inválidas",
          content = @Content(
              mediaType = "application/json"
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor")
  })
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody(description = "Credenciales del usuario para la autenticación", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = AuthenticationRequest.class)
          )
      ) AuthenticationRequest request) {
    return ResponseEntity.ok(authService.authenticate(request));
  }

  @PostMapping("/recoverPassword")
  @Operation(
      summary = "Recuperar contraseña",
      description = "Envía un correo electrónico de recuperación de contraseña al usuario."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Correo de recuperación de contraseña enviado exitosamente"),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor")
  })
  public ResponseEntity<String> recoverPassword(
    @RequestBody(description = "Dirección de correo electrónico del usuario que solicita la recuperación de contraseña", required = true,
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
      summary = "Restablecer contraseña",
      description = "Restablece la contraseña del usuario utilizando un código de verificación."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Contraseña restablecida exitosamente"),
      @ApiResponse(responseCode = "400", description = "Solicitud incorrecta - Entrada inválida",
          content = @Content(
              mediaType = "application/json"
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor")
  })
  public ResponseEntity<String> resetPassword(
    @RequestBody(description = "Detalles para restablecer la contraseña", required = true,
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