package com.uade.tpo.demo.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.models.responses.SavedRecipeDTO;
import com.uade.tpo.demo.service.SavedRecipeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/savedRecipes")
@Tag(name = "Recetas Guardadas", description = "Endpoints para la gestión de recetas guardadas")
public class SavedRecipeController {

    @Autowired
    private SavedRecipeService savedRecipeService;

    @GetMapping("/mySavedRecipes")
    @Operation(
        summary = "Obtener recetas guardadas del usuario",
        description = "Devuelve una lista de todas las recetas guardadas por el usuario autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de recetas guardadas obtenida exitosamente",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = SavedRecipeDTO.class))
            )),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor",
            content = @Content(schema = @Schema(hidden = true))
        )
    })
    public ResponseEntity<Object> getMySavedRecipes(Principal principal) {
        try {
            return ResponseEntity.ok(savedRecipeService.getSavedRecipesOfUser(principal.getName()).stream().map(SavedRecipeDTO::new).toList());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/{id}")
    @Operation(
        summary = "Guardar una receta",
        description = "Guarda una receta específica para el usuario autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Receta guardada exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor",
            content = @Content(schema = @Schema(hidden = true))
        )
    })
    public ResponseEntity<String> saveRecipe(Principal principal, @PathVariable Integer id) {
        try {
            return ResponseEntity.ok(savedRecipeService.saveRecipe(principal, id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Eliminar una receta guardada",
        description = "Elimina una receta guardada específica del usuario autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Receta eliminada exitosamente",
            content = @Content(schema = @Schema(hidden = true))
        ),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor",
            content = @Content(schema = @Schema(hidden = true))
        )
    })
    public ResponseEntity<String> deleteSavedRecipe(Principal principal, @PathVariable Integer id) {
        try {
            savedRecipeService.deleteSavedRecipe(principal.getName(), id);
            return ResponseEntity.ok("Receta eliminada exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}
