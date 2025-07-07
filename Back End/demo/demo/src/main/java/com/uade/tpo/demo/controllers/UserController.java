package com.uade.tpo.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.models.requests.StudentRequest;
import com.uade.tpo.demo.models.requests.UpdateUserRequest;
import com.uade.tpo.demo.models.responses.UserDTO;
import com.uade.tpo.demo.models.responses.UserDTOReduced;
import com.uade.tpo.demo.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.security.Principal;

@RestController
@RequestMapping("/users")
@Tag(name = "Usuarios", description = "Endpoints para la gestión de usuarios")
public class UserController {

  @Autowired
  private UserService userService;

  @GetMapping("/whoAmI")
  @Operation(
      summary = "Obtener información del usuario autenticado",
      description = "Devuelve los detalles del usuario actualmente autenticado."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Información del usuario obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDTO.class)
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> whoami(Principal principal) {
    return ResponseEntity.ok(new UserDTO(userService.getUserByEmail(principal.getName()).orElseThrow()));
  }

  @GetMapping()
  @Operation(
      summary = "Obtener todos los usuarios",
      description = "Devuelve una lista de todos los usuarios registrados en el sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = UserDTOReduced.class))
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> GetUsers() {
    try {
      return ResponseEntity.ok(userService.getUsers().stream().map(UserDTOReduced::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{userId}")
  @Operation(
      summary = "Obtener un usuario por ID",
      description = "Devuelve los detalles de un usuario específico basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Usuario obtenido exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Usuario no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getUserById(@PathVariable Long userId) {
    try {
      return ResponseEntity.ok(new UserDTO(userService.getUserById(userId).orElseThrow()));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{userId}")
  @Operation(
      summary = "Eliminar un usuario",
      description = "Elimina un usuario específico basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Usuario eliminado exitosamente",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> deleteUser(@PathVariable Long userId) {
    try {
      userService.deleteUser(userId);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/enable/{userId}")
  @Operation(
      summary = "Habilitar un usuario",
      description = "Habilita un usuario específico basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Usuario habilitado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDTOReduced.class)
          )),
      @ApiResponse(responseCode = "404", description = "Usuario no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> enableUser(@PathVariable Long userId) {
    try {
      return ResponseEntity.ok(new UserDTOReduced(userService.enableUser(userId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/upgradeToStudent") //TODO lo convierte a alumno pero tira este error: getCourseAttendances()" is null
  @Operation(
      summary = "Actualizar un usuario a alumno",
      description = "Actualiza un usuario específico a alumno."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Usuario actualizado a alumno exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Usuario no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> upgradeToStudent(Principal principal, @RequestBody StudentRequest studentRequest) {
    try {
      return ResponseEntity.ok(new UserDTO(userService.upgradeToStudent(principal, studentRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/updateProfile")
  @Operation(
      summary = "Actualizar perfil del usuario",
      description = "Permite al usuario autenticado actualizar su alias, foto de perfil y domicilio."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Perfil actualizado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDTO.class)
          )),
      @ApiResponse(responseCode = "400", description = "Datos inválidos.",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateProfile(
      Principal principal,
      @RequestBody UpdateUserRequest updateUserRequest
  ) {
      try {
          return ResponseEntity.ok(new UserDTO(userService.updateProfile(principal.getName(), updateUserRequest.getNombre(), updateUserRequest.getNickname(), updateUserRequest.getDireccion(), updateUserRequest.getAvatar())));
      } catch (Exception e) {
          return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
      }
  }

  @PutMapping("/updateEmail")
  @Operation(
      summary = "Actualizar correo electrónico del usuario",
      description = "Permite al usuario autenticado actualizar su correo electrónico."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Correo electrónico actualizado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDTO.class)
          )),
      @ApiResponse(responseCode = "400", description = "Correo electrónico inválido o ya en uso.",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateEmail(Principal principal, @RequestParam String newEmail) {
      try {
          return ResponseEntity.ok(new UserDTO(userService.updateEmail(principal.getName(), newEmail)));
      } catch (Exception e) {
          return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
      }
  }

  @PutMapping("/updatePassword")
  @Operation(
      summary = "Actualizar contraseña del usuario",
      description = "Permite al usuario autenticado actualizar su contraseña."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Contraseña actualizada exitosamente",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "400", description = "Contraseña actual inválida.",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updatePassword(Principal principal, @RequestParam String currentPassword, @RequestParam String newPassword) {
      try {
          userService.updatePassword(principal.getName(), currentPassword, newPassword);
          return ResponseEntity.ok("Contraseña actualizada exitosamente.");
      } catch (Exception e) {
          return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
      }
  }

  @PutMapping("/updateCard")
  @Operation(
      summary = "Actualizar tarjeta del estudiante",
      description = "Permite al estudiante autenticado actualizar su información de tarjeta."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Tarjeta actualizada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDTO.class)
          )),
      @ApiResponse(responseCode = "400", description = "Datos de tarjeta inválidos.",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "404", description = "Usuario no es estudiante.",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateCard(Principal principal, @RequestBody StudentRequest studentRequest) {
    try {
      return ResponseEntity.ok(new UserDTO(userService.updateCard(principal, studentRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

}
