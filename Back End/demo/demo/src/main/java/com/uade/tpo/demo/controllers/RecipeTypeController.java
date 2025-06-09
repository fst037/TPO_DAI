package com.uade.tpo.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.models.requests.RecipeTypeRequest;
import com.uade.tpo.demo.models.responses.RecipeTypeDTO;
import com.uade.tpo.demo.service.RecipeTypeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/recipeTypes")
@Tag(name = "Tipos de Recetas", description = "Endpoints para la gestión de tipos de recetas")
public class RecipeTypeController {

  @Autowired
  private RecipeTypeService recipeTypeService;

  @GetMapping("/")
  @Operation(
      summary = "Obtener todos los tipos de recetas",
      description = "Devuelve una lista de todos los tipos de recetas disponibles en el sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de tipos de recetas obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = RecipeTypeDTO.class))
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getAllRecipeTypes() {
    try {
      return ResponseEntity.ok(recipeTypeService.getAllRecipeTypes().stream().map(RecipeTypeDTO::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{id}")
  @Operation(
      summary = "Obtener un tipo de receta por ID",
      description = "Devuelve los detalles de un tipo de receta específico basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Tipo de receta obtenido exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeTypeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Tipo de receta no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getRecipeTypeById(@PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new RecipeTypeDTO(recipeTypeService.getRecipeTypeById(id)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/")
  @Operation(
      summary = "Crear un nuevo tipo de receta",
      description = "Crea un nuevo tipo de receta en el sistema.",
      requestBody = @RequestBody(
          description = "Detalles del tipo de receta a crear", 
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeTypeRequest.class)
          )
      )
  )

  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Tipo de receta creado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeTypeDTO.class)
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })

  public ResponseEntity<Object> createRecipeType(
    @org.springframework.web.bind.annotation.RequestBody RecipeTypeRequest recipeTypeRequest) {
    try {
      return ResponseEntity.ok(new RecipeTypeDTO(recipeTypeService.createRecipeType(recipeTypeRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  @Operation(
      summary = "Actualizar un tipo de receta",
      description = "Actualiza los detalles de un tipo de receta existente basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Tipo de receta actualizado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeTypeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Tipo de receta no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateRecipeType(
      @PathVariable Integer id,
      @RequestBody(description = "Detalles del tipo de receta a actualizar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeTypeRequest.class)
          )
      ) RecipeTypeRequest recipeTypeRequest) {
    try {
      return ResponseEntity.ok(new RecipeTypeDTO(recipeTypeService.updateRecipeType(id, recipeTypeRequest)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  @Operation(
      summary = "Eliminar un tipo de receta",
      description = "Elimina un tipo de receta existente basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Tipo de receta eliminado exitosamente",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "404", description = "Tipo de receta no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> deleteRecipeType(@PathVariable Integer id) {
    try {
      recipeTypeService.deleteRecipeType(id);
      return ResponseEntity.ok("Tipo de receta eliminado exitosamente.");
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
