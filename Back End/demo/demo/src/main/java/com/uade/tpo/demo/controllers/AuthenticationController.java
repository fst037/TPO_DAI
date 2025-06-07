package com.uade.tpo.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.exceptions.ExistingUserException;
import com.uade.tpo.demo.models.requests.AuthenticationRequest;
import com.uade.tpo.demo.models.requests.RecoverPasswordRequest;
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
      description = "Envía una solicitud de registro inicial para un nuevo usuario.",
      requestBody = @RequestBody(
          description = "Detalles para la solicitud de registro inicial",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RequestInitialRegisterRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Solicitud de registro exitosa o mensaje indicando que el correo ya está registrado pero no verificado."),
      @ApiResponse(responseCode = "400", description = "El nickname ya está en uso, se sugieren alternativas.",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> requestInitialRegister(
      @org.springframework.web.bind.annotation.RequestBody RequestInitialRegisterRequest request
  ) throws ExistingUserException {
    try {
      return ResponseEntity.ok(authService.requestInitialRegister(request));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/register")
  @Operation(
      summary = "Registrar un nuevo usuario",
      description = "Registra un nuevo usuario en el sistema.",
      requestBody = @RequestBody(
          description = "Detalles del usuario a registrar",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RegisterRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Usuario registrado exitosamente.",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = AuthenticationResponse.class)
          )),
      @ApiResponse(responseCode = "400", description = "Datos incorrectos como código de verificación, email o nickname.",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "401", description = "El usuario ha sido registrado pero no está habilitado.",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<String> register(
    
    @org.springframework.web.bind.annotation.RequestBody RegisterRequest request)
    throws ExistingUserException {
    return ResponseEntity.ok(authService.register(request));
  }

  @PostMapping("/authenticate")
  @Operation(
      summary = "Autenticar un usuario",
      description = "Autentica un usuario y devuelve un token si las credenciales son válidas.",
      requestBody = @RequestBody(
          description = "Credenciales del usuario para la autenticación",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = AuthenticationRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Autenticación exitosa y token generado.",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = AuthenticationResponse.class)
          )),
      @ApiResponse(responseCode = "401", description = "No autorizado - Credenciales inválidas.",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<AuthenticationResponse> authenticate(
    @org.springframework.web.bind.annotation.RequestBody AuthenticationRequest request){
    return ResponseEntity.ok(authService.authenticate(request));
  }
 
  
  @PostMapping("/recoverPassword")
  @Operation(
      summary = "Recuperar contraseña",
      description = "Envía un correo electrónico de recuperación de contraseña al usuario.",
      requestBody = @RequestBody(
          description = "Dirección de correo electrónico del usuario que solicita la recuperación de contraseña",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecoverPasswordRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Código de recuperación enviado exitosamente."),
      @ApiResponse(responseCode = "400", description = "El correo no está registrado o no ha sido verificado.",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<String> recoverPassword(@org.springframework.web.bind.annotation.RequestBody RecoverPasswordRequest request) {
    try {
      return ResponseEntity.ok(authService.recoverPassword(request.getEmail()));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
    
  @PostMapping("/resetPassword")
  @Operation(
      summary = "Restablecer contraseña",
      description = "Restablece la contraseña del usuario utilizando un código de verificación.",
      requestBody = @RequestBody(
          description = "Detalles para restablecer la contraseña",
          required = true,
          content = @Content(
              mediaType = "application/json",
                schema = @Schema(implementation = ResetPasswordRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Contraseña restablecida exitosamente."),
      @ApiResponse(responseCode = "400", description = "Código de verificación incorrecto o expirado.",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })

  public ResponseEntity<String> resetPassword(
    @org.springframework.web.bind.annotation.RequestBody ResetPasswordRequest request) 
    throws ExistingUserException {
    try {
      return ResponseEntity.ok(authService.resetPassword(request.getEmail(), request.getVerificationCode(), request.getPassword()));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}