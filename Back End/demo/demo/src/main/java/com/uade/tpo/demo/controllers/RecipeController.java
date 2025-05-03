package com.uade.tpo.demo.controllers;
import com.uade.tpo.demo.models.requests.MultimediaContentRequest;
import com.uade.tpo.demo.models.requests.PhotoRequest;
import com.uade.tpo.demo.models.requests.RatingRequest;
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
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

  @Autowired
  private RecipeService recipeService;

  @GetMapping("/myRecipes")
  public ResponseEntity<Object> getMyRecipes(Principal principal) {
    try {
      return ResponseEntity.ok(recipeService.getRecipesOfUser(principal, principal.getName()).stream().map(RecipeDTOReduced::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/")
  public ResponseEntity<Object> getAllRecipes(Principal principal) {
    try {
      return ResponseEntity.ok(recipeService.getAllRecipes(principal).stream().map(RecipeDTOReduced::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<Object> getRecipeById(Principal principal, @PathVariable Long id) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.getRecipeById(principal, id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
  
  @PostMapping("/")
  public ResponseEntity<Object> createRecipe(Principal principal, @RequestBody RecipeRequest recipeRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.createRecipe(principal.getName(), recipeRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/enable/{id}")
  public ResponseEntity<Object> enableRecipe(@PathVariable Long id) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.enableRecipe(id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Object> updateRecipe(Principal principal, @PathVariable Long id, @RequestBody RecipeRequest recipeRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.updateRecipe(principal.getName(), id, recipeRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Object> deleteRecipe(Principal principal, @PathVariable Long id) {
    try {
      recipeService.deleteRecipe(principal.getName(), id);
      return ResponseEntity.ok("Recipe deleted successfully");
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/addPhoto")
  public ResponseEntity<Object> addPhotoToRecipe(Principal principal, @PathVariable Long id, @RequestBody PhotoRequest photoRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.addPhotoToRecipe(principal.getName(), id, photoRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/removePhoto/{photoId}")
  public ResponseEntity<Object> removePhotoFromRecipe(Principal principal, @PathVariable Long id, @PathVariable Integer photoId) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.removePhotoFromRecipe(principal.getName(), id, photoId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/addStep")
  public ResponseEntity<Object> addStepToRecipe(Principal principal, @PathVariable Long id, @RequestBody StepRequest stepRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.addStepToRecipe(principal.getName(), id, stepRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}/updateStep/{stepId}")
  public ResponseEntity<Object> updateStepInRecipe(Principal principal, @PathVariable Long id, @PathVariable Integer stepId, @RequestBody StepRequest stepRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.updateStepInRecipe(principal.getName(), id, stepId, stepRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/removeStep/{stepId}")
  public ResponseEntity<Object> removeStepFromRecipe(Principal principal, @PathVariable Long id, @PathVariable Integer stepId) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.removeStepFromRecipe(principal.getName(), id, stepId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/updateStep/{stepId}/addMultimedia/")
  public ResponseEntity<Object> addMultimediaToStep(Principal principal, @PathVariable Long id, @PathVariable Integer stepId, @RequestBody MultimediaContentRequest multimediaContentRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.addMultimediaToStep(principal.getName(), id, stepId, multimediaContentRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/updateStep/{stepId}/removeMultimedia/{multimediaId}")
  public ResponseEntity<Object> removeMultimediaFromStep(Principal principal, @PathVariable Long id, @PathVariable Integer stepId, @PathVariable Integer multimediaId) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.removeMultimediaFromStep(principal.getName(), id, stepId, multimediaId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/addUsedIngredient")
  public ResponseEntity<Object> addIngredientToRecipe(Principal principal, @PathVariable Long id, @RequestBody UsedIngredientRequest usedIngredientRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.addIngredientToRecipe(principal.getName(), id, usedIngredientRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}/updateUsedIngredient/{usedIngredientId}")
  public ResponseEntity<Object> updateIngredientInRecipe(Principal principal, @PathVariable Long id, @PathVariable Integer usedIngredientId, @RequestBody UsedIngredientRequest usedIngredientRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.updateIngredientInRecipe(principal.getName(), id, usedIngredientId, usedIngredientRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/removeUsedIngredient/{usedIngredientId}")
  public ResponseEntity<Object> removeIngredientFromRecipe(Principal principal, @PathVariable Long id, @PathVariable Integer usedIngredientId) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.removeIngredientFromRecipe(principal.getName(), id, usedIngredientId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/addRating")
  public ResponseEntity<Object> addRatingToRecipe(Principal principal, @PathVariable Long id, @RequestBody RatingRequest ratingRequest) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.addRatingToRecipe(principal.getName(), id, ratingRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/removeRating/{ratingId}")
  public ResponseEntity<Object> removeRatingFromRecipe(Principal principal, @PathVariable Long id, @PathVariable Integer ratingId) {
    try {
      return ResponseEntity.ok(new RecipeDTO(recipeService.removeRatingFromRecipe(principal.getName(), id, ratingId)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/{id}/addToFavorites")
  public ResponseEntity<Object> addRecipeToFavorites(Principal principal, @PathVariable Long id) {
    try {
      return ResponseEntity.ok(new UserDTO(recipeService.addRecipeToFavorites(principal.getName(), id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}/removeFromFavorites")
  public ResponseEntity<Object> removeRecipeFromFavorites(Principal principal, @PathVariable Long id) {
    try {
      return ResponseEntity.ok(new UserDTO(recipeService.removeRecipeFromFavorites(principal.getName(), id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
