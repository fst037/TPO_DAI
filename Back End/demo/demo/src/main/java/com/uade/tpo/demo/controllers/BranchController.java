package com.uade.tpo.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.models.requests.BranchRequest;
import com.uade.tpo.demo.models.responses.BranchDTO;
import com.uade.tpo.demo.service.BranchService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/branches")
@Tag(name = "Sedes", description = "Endpoints para la gestión de sedes")
public class BranchController {

  @Autowired
  private BranchService branchService;

  @GetMapping("/")
  @Operation(
      summary = "Obtener todas las sedes",
      description = "Devuelve una lista de todas las sedes disponibles en el sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de sedes obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = BranchDTO.class))
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getAllBranches() {
    try {
      return ResponseEntity.ok(branchService.getAllBranches().stream().map(BranchDTO::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{id}")
  @Operation(
      summary = "Obtener una sede por ID",
      description = "Devuelve los detalles de una sede específica basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Sede obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = BranchDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Sede no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getBranchById(@PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new BranchDTO(branchService.getBranchById(id)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/")
  @Operation(
      summary = "Crear una nueva sede",
      description = "Crea una nueva sede en el sistema.",
      requestBody = @RequestBody(description = "Detalles de la sede a crear", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = BranchRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Sede creada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = BranchDTO.class)
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> createBranch(
      @org.springframework.web.bind.annotation.RequestBody BranchRequest branchRequest) {
    try {
      return ResponseEntity.ok(new BranchDTO(branchService.createBranch(branchRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  @Operation(
      summary = "Actualizar una sede",
      description = "Actualiza los detalles de una sede existente basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Sede actualizada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = BranchDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Sede no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateBranch(
      @PathVariable Integer id,
      @RequestBody(description = "Detalles de la sede a actualizar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = BranchRequest.class)
          )
      ) BranchRequest branchRequest) {
    try {
      return ResponseEntity.ok(new BranchDTO(branchService.updateBranch(id, branchRequest)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  @Operation(
      summary = "Eliminar una sede",
      description = "Elimina una sede existente basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Sede eliminada exitosamente",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "404", description = "Sede no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> deleteBranch(@PathVariable Integer id) {
    try {
      branchService.deleteBranch(id);
      return ResponseEntity.ok("Sede eliminada exitosamente.");
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
