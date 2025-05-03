package com.uade.tpo.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.models.requests.IngredientRequest;
import com.uade.tpo.demo.models.responses.IngredientDTO;
import com.uade.tpo.demo.service.IngredientService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/ingredients")
@Tag(name = "Ingredientes", description = "Endpoints para la gestión de ingredientes")
public class IngredientController {

  @Autowired
  private IngredientService ingredientService;

  @GetMapping("/")
  @Operation(
      summary = "Obtener todos los ingredientes",
      description = "Devuelve una lista de todos los ingredientes disponibles en el sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de ingredientes obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = IngredientDTO.class))
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getAllIngredients() {
    try {
      return ResponseEntity.ok(ingredientService.getAllIngredients().stream().map(IngredientDTO::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{id}")
  @Operation(
      summary = "Obtener un ingrediente por ID",
      description = "Devuelve los detalles de un ingrediente específico basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Ingrediente obtenido exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = IngredientDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Ingrediente no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getIngredientById(@PathVariable Long id) {
    try {
      return ResponseEntity.ok(new IngredientDTO(ingredientService.getIngredientById(id)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/")
  @Operation(
      summary = "Crear un nuevo ingrediente",
      description = "Crea un nuevo ingrediente en el sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Ingrediente creado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = IngredientDTO.class)
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> createIngredient(
      @RequestBody(description = "Detalles del ingrediente a crear", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = IngredientRequest.class)
          )
      ) IngredientRequest ingredientRequest) {
    try {
      return ResponseEntity.ok(new IngredientDTO(ingredientService.createIngredient(ingredientRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  @Operation(
      summary = "Actualizar un ingrediente",
      description = "Actualiza los detalles de un ingrediente existente basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Ingrediente actualizado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = IngredientDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Ingrediente no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateIngredient(
      @PathVariable Long id,
      @RequestBody(description = "Detalles del ingrediente a actualizar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = IngredientRequest.class)
          )
      ) IngredientRequest ingredientRequest) {
    try {
      return ResponseEntity.ok(new IngredientDTO(ingredientService.updateIngredient(id, ingredientRequest)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  @Operation(
      summary = "Eliminar un ingrediente",
      description = "Elimina un ingrediente existente basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Ingrediente eliminado exitosamente",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "404", description = "Ingrediente no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> deleteIngredient(@PathVariable Long id) {
    try {
      ingredientService.deleteIngredient(id);
      return ResponseEntity.ok("Ingrediente eliminado exitosamente.");
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
