package com.uade.tpo.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.models.requests.UnitRequest;
import com.uade.tpo.demo.models.responses.UnitDTO;
import com.uade.tpo.demo.service.UnitService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/units")
@Tag(name = "Unidades", description = "Endpoints para la gestión de unidades")
public class UnitController {

  @Autowired
  private UnitService unitService;

  @GetMapping("/")
  @Operation(
      summary = "Obtener todas las unidades",
      description = "Devuelve una lista de todas las unidades disponibles en el sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de unidades obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = UnitDTO.class))
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getAllUnits() {
    try {
      return ResponseEntity.ok(unitService.getAllUnits().stream().map(UnitDTO::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{id}")
  @Operation(
      summary = "Obtener una unidad por ID",
      description = "Devuelve los detalles de una unidad específica basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Unidad obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UnitDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Unidad no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getUnitById(@PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new UnitDTO(unitService.getUnitById(id)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/")
  @Operation(
      summary = "Crear una nueva unidad",
      description = "Crea una nueva unidad en el sistema.",
      requestBody = @RequestBody(description = "Detalles de la unidad a crear", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UnitRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Unidad creada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UnitDTO.class)
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> createUnit(
      @org.springframework.web.bind.annotation.RequestBody UnitRequest unitRequest) {
    try {
      return ResponseEntity.ok(new UnitDTO(unitService.createUnit(unitRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  @Operation(
      summary = "Actualizar una unidad",
      description = "Actualiza los detalles de una unidad existente basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Unidad actualizada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UnitDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Unidad no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateUnit(
      @PathVariable Integer id,
      @RequestBody(description = "Detalles de la unidad a actualizar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UnitRequest.class)
          )
      ) UnitRequest unitRequest) {
    try {
      return ResponseEntity.ok(new UnitDTO(unitService.updateUnit(id, unitRequest)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  @Operation(
      summary = "Eliminar una unidad",
      description = "Elimina una unidad existente basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Unidad eliminada exitosamente",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "404", description = "Unidad no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> deleteUnit(@PathVariable Integer id) {
    try {
      unitService.deleteUnit(id);
      return ResponseEntity.ok("Unidad eliminada exitosamente.");
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
