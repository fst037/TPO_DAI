package com.uade.tpo.demo.controllers;
import com.uade.tpo.demo.models.requests.MultimediaContentRequest;
import com.uade.tpo.demo.models.requests.PhotoRequest;
import com.uade.tpo.demo.models.requests.RatingRequest;
import com.uade.tpo.demo.models.requests.RecipeFilterRequest;
import com.uade.tpo.demo.models.requests.RecipeRequest;
import com.uade.tpo.demo.models.requests.StepRequest;
import com.uade.tpo.demo.models.requests.UsedIngredientRequest;
import com.uade.tpo.demo.models.responses.RecipeDTO;
import com.uade.tpo.demo.models.responses.RecipeDTOReduced;
import com.uade.tpo.demo.models.responses.UserDTO;
import com.uade.tpo.demo.service.RecipeService;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/recipes")
@Tag(name = "Recetas", description = "Endpoints para la gestión de recetas")
public class RecipeController {

  @Autowired
  private RecipeService recipeService;

  @GetMapping("/myRecipes")
  @Operation(
      summary = "Obtener recetas del usuario autenticado",
      description = "Devuelve una lista de todas las recetas creadas por el usuario autenticado."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de recetas obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = RecipeDTOReduced.class))
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getMyRecipes(Principal principal) {
    try {
      return ResponseEntity.ok(recipeService.getRecipesOfUser(principal, principal.getName()).stream().map(RecipeDTOReduced::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/")
  @Operation(
      summary = "Obtener todas las recetas",
      description = "Devuelve una lista de todas las recetas disponibles en el sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de recetas obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = RecipeDTOReduced.class))
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getAllRecipes(Principal principal) {
    try {
      return ResponseEntity.ok(recipeService.getAllRecipes(principal).stream().map(RecipeDTOReduced::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/lastAdded")
  @Operation(
      summary = "Obtener las últimas recetas añadidas",
      description = "Devuelve una lista de las últimas recetas añadidas al sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de recetas obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = RecipeDTOReduced.class))
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getLastAddedRecipes(Principal principal) {
    try {
      return ResponseEntity.ok(recipeService.getLastAddedRecipes(principal).stream().map(RecipeDTOReduced::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/filter")
  @Operation(
      summary = "Filtrar recetas",
      description = "Devuelve una lista de recetas que cumplen con los criterios de filtrado especificados."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de recetas filtradas obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = RecipeDTOReduced.class))
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getFilteredRecipes(
      Principal principal,
      @RequestBody(description = "Criterios de filtrado para las recetas", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeFilterRequest.class)
          )
      ) RecipeFilterRequest recipeFilterRequest) {
    try {
      return ResponseEntity.ok(recipeService.getFilteredRecipes(principal, recipeFilterRequest).stream().map(RecipeDTOReduced::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{id}")
  @Operation(
      summary = "Obtener una receta por ID",
      description = "Devuelve los detalles de una receta específica basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Receta obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getRecipeById(Principal principal, @PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.getRecipeById(principal, id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/isNameAvaliable/{name}")
  @Operation(
      summary = "Verificar disponibilidad de nombre de receta",
      description = "Verifica si un nombre de receta está disponible para el usuario autenticado."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Disponibilidad del nombre verificada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = Boolean.class))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> isRecipeNameAvailable(Principal principal, @PathVariable String name) {
    try {
      return ResponseEntity.ok(recipeService.isRecipeNameAvailable(principal, name));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
  
  @PostMapping("/")
  @Operation(
      summary = "Crear una nueva receta",
      description = "Crea una nueva receta en el sistema para el usuario autenticado.",
      requestBody = @RequestBody(description = "Detalles de la receta a crear", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Receta creada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> createRecipe(
      Principal principal,
      @org.springframework.web.bind.annotation.RequestBody RecipeRequest recipeRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.createRecipe(principal.getName(), recipeRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/replaceByName/{name}")
  @Operation(
      summary = "Reemplazar una receta por nombre",
      description = "Reemplaza una receta existente con el nombre especificado por una nueva receta.",
      requestBody = @RequestBody(description = "Detalles de la receta a reemplazar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Receta reemplazada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> createRecipeByName(
      Principal principal,
      @PathVariable String name,
      @org.springframework.web.bind.annotation.RequestBody RecipeRequest recipeRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.replaceRecipe(principal.getName(), name, recipeRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/enable/{id}")
  @Operation(
      summary = "Habilitar una receta",
      description = "Habilita una receta específica basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Receta habilitada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> enableRecipe(@PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.enableRecipe(id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  @Operation(
      summary = "Actualizar una receta",
      description = "Actualiza los detalles de una receta existente basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Receta actualizada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateRecipe(
      Principal principal,
      @PathVariable Integer id,
      @RequestBody(description = "Detalles de la receta a actualizar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeRequest.class)
          )
      ) RecipeRequest recipeRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.updateRecipe(principal.getName(), id, recipeRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  @Operation(
      summary = "Eliminar una receta",
      description = "Elimina una receta existente basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Receta eliminada exitosamente",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> deleteRecipe(Principal principal, @PathVariable Integer id) {
    try {
      recipeService.deleteRecipe(principal.getName(), id);
      return ResponseEntity.ok("Recipe deleted successfully");
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/addPhoto")
  @Operation(
      summary = "Agregar una foto a una receta",
      description = "Agrega una foto a una receta específica basada en su ID.",
      requestBody = @RequestBody(description = "Detalles de la foto a agregar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = PhotoRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Foto agregada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> addPhotoToRecipe(
      Principal principal,
      @PathVariable Integer id,
      @org.springframework.web.bind.annotation.RequestBody PhotoRequest photoRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.addPhotoToRecipe(principal.getName(), id, photoRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/removePhoto/{photoId}")
  @Operation(
      summary = "Eliminar una foto de una receta",
      description = "Elimina una foto específica de una receta basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Foto eliminada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta o foto no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> removePhotoFromRecipe(Principal principal, @PathVariable Integer id, @PathVariable Integer photoId) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.removePhotoFromRecipe(principal.getName(), id, photoId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/addStep")
  @Operation(
      summary = "Agregar un paso a una receta",
      description = "Agrega un paso a una receta específica basada en su ID.",
      requestBody = @RequestBody(description = "Detalles del paso a agregar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = StepRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Paso agregado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> addStepToRecipe(
      Principal principal,
      @PathVariable Integer id,
      @org.springframework.web.bind.annotation.RequestBody StepRequest stepRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.addStepToRecipe(principal.getName(), id, stepRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}/updateStep/{stepId}")
  @Operation(
      summary = "Actualizar un paso en una receta",
      description = "Actualiza un paso específico en una receta basada en su ID.",
      requestBody = @RequestBody(description = "Detalles del paso a actualizar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = StepRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Paso actualizado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta o paso no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateStepInRecipe(
      Principal principal,
      @PathVariable Integer id,
      @PathVariable Integer stepId,
      @org.springframework.web.bind.annotation.RequestBody StepRequest stepRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.updateStepInRecipe(principal.getName(), id, stepId, stepRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/removeStep/{stepId}")
  @Operation(
      summary = "Eliminar un paso de una receta",
      description = "Elimina un paso específico de una receta basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Paso eliminado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta o paso no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> removeStepFromRecipe(Principal principal, @PathVariable Integer id, @PathVariable Integer stepId) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.removeStepFromRecipe(principal.getName(), id, stepId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/updateStep/{stepId}/addMultimedia")
  @Operation(
      summary = "Agregar contenido multimedia a un paso",
      description = "Agrega contenido multimedia a un paso específico de una receta.",
      requestBody = @RequestBody(description = "Detalles del contenido multimedia a agregar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = MultimediaContentRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Contenido multimedia agregado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta o paso no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> addMultimediaToStep(
      Principal principal,
      @PathVariable Integer id,
      @PathVariable Integer stepId,
      @org.springframework.web.bind.annotation.RequestBody MultimediaContentRequest multimediaContentRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.addMultimediaToStep(principal.getName(), id, stepId, multimediaContentRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/updateStep/{stepId}/removeMultimedia/{multimediaId}")
  @Operation(
      summary = "Eliminar contenido multimedia de un paso",
      description = "Elimina contenido multimedia de un paso específico de una receta."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Contenido multimedia eliminado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta, paso o contenido multimedia no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> removeMultimediaFromStep(Principal principal, @PathVariable Integer id, @PathVariable Integer stepId, @PathVariable Integer multimediaId) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.removeMultimediaFromStep(principal.getName(), id, stepId, multimediaId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/addUsedIngredient")
  @Operation(
      summary = "Agregar un ingrediente a una receta",
      description = "Agrega un ingrediente a una receta específica basada en su ID.",
      requestBody = @RequestBody(description = "Detalles del ingrediente a agregar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UsedIngredientRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Ingrediente agregado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta o ingrediente no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> addIngredientToRecipe(Principal principal, @PathVariable Integer id, 
    @org.springframework.web.bind.annotation.RequestBody UsedIngredientRequest usedIngredientRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.addIngredientToRecipe(principal.getName(), id, usedIngredientRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}/updateUsedIngredient/{usedIngredientId}")
  @Operation(
      summary = "Actualizar un ingrediente en una receta",
      description = "Actualiza un ingrediente específico en una receta basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Ingrediente actualizado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta o ingrediente no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateIngredientInRecipe(Principal principal, @PathVariable Integer id, @PathVariable Integer usedIngredientId, @RequestBody(description = "Detalles del ingrediente a actualizar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UsedIngredientRequest.class)
          )
      ) UsedIngredientRequest usedIngredientRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.updateIngredientInRecipe(principal.getName(), id, usedIngredientId, usedIngredientRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/removeUsedIngredient/{usedIngredientId}")
  @Operation(
      summary = "Eliminar un ingrediente de una receta",
      description = "Elimina un ingrediente específico de una receta basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Ingrediente eliminado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta o ingrediente no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> removeIngredientFromRecipe(Principal principal, @PathVariable Integer id, @PathVariable Integer usedIngredientId) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.removeIngredientFromRecipe(principal.getName(), id, usedIngredientId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/addRating")
  @Operation(
      summary = "Agregar una valoración a una receta",
      description = "Agrega una valoración a una receta específica basada en su ID.",
      requestBody = @RequestBody(description = "Detalles de la valoración a agregar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RatingRequest.class)
          )
      )
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Valoración agregada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> addRatingToRecipe(Principal principal, @PathVariable Integer id, 
    @org.springframework.web.bind.annotation.RequestBody RatingRequest ratingRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.addRatingToRecipe(principal.getName(), id, ratingRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}/enableRating/{ratingId}")
  @Operation(
      summary = "Habilitar una valoración en una receta",
      description = "Habilita una valoración específica en una receta basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Valoración habilitada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta o valoración no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> enableRating(Principal principal, @PathVariable Integer id, @PathVariable Integer ratingId) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.enableRating(id, ratingId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/removeRating/{ratingId}")
  @Operation(
      summary = "Eliminar una valoración de una receta",
      description = "Elimina una valoración específica de una receta basada en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Valoración eliminada exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RecipeDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta o valoración no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> removeRatingFromRecipe(Principal principal, @PathVariable Integer id, @PathVariable Integer ratingId) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.removeRatingFromRecipe(principal.getName(), id, ratingId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/addToFavorites")
  @Operation(
      summary = "Agregar una receta a favoritos",
      description = "Agrega una receta específica a la lista de favoritos del usuario autenticado."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Receta agregada a favoritos exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> addRecipeToFavorites(Principal principal, @PathVariable Integer id) {
    System.out.println(principal.getName());
    System.out.println(id);
    try {
      return ResponseEntity.ok(new UserDTO(recipeService.addRecipeToFavorites(principal.getName(), id)));
    } catch (Exception e) {
        System.out.println("HOLA");
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/removeFromFavorites")
  @Operation(
      summary = "Eliminar una receta de favoritos",
      description = "Elimina una receta específica de la lista de favoritos del usuario autenticado."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Receta eliminada de favoritos exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> removeRecipeFromFavorites(Principal principal, @PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new UserDTO(recipeService.removeRecipeFromFavorites(principal.getName(), id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/addToRemindLater")
  @Operation(
      summary = "Agregar una receta a recordar más tarde",
      description = "Agrega una receta específica a la lista de recordar más tarde del usuario autenticado."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Receta agregada a recordar más tarde exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> addRecipeToRemindLater(Principal principal, @PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new UserDTO(recipeService.addRecipeToRemindLater(principal.getName(), id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/removeFromRemindLater")
  @Operation(
      summary = "Eliminar una receta de recordar más tarde",
      description = "Elimina una receta específica de la lista de recordar más tarde del usuario autenticado."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Receta eliminada de recordar más tarde exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UserDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Receta no encontrada",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> removeRecipeFromRemindLater(Principal principal, @PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new UserDTO(recipeService.removeRecipeFromRemindLater(principal.getName(), id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
