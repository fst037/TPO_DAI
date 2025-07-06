package com.uade.tpo.demo.models.responses;

import java.security.Principal;
import java.util.List;

import com.uade.tpo.demo.models.objects.Rating;
import com.uade.tpo.demo.models.objects.Recipe;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa una receta.")
public class RecipeDTO {
  @Schema(description = "Identificador único de la receta", example = "1")
  private Integer id;

  @Schema(description = "Indica si la receta está habilitada", example = "true")
  private Boolean isEnabled;

  @Schema(description = "Usuario que creó la receta")
  private UserDTOReduced user;

  @Schema(description = "Nombre de la receta", example = "Tarta de manzana")
  private String recipeName;

  @Schema(description = "Descripción de la receta", example = "Una deliciosa tarta de manzana casera.")
  private String recipeDescription;

  @Schema(description = "URL de la foto principal de la receta", example = "https://example.com/photos/main.jpg")
  private String mainPhoto;

  @Schema(description = "Cantidad de porciones que rinde la receta", example = "4")
  private Integer servings;

  @Schema(description = "Número de personas para las que está diseñada la receta", example = "4")
  private Integer numberOfPeople;

  @Schema(description = "Tiempo de cocción en minutos", example = "45")
  private Integer cookingTime;

  @Schema(description = "Tipo de receta")
  private RecipeTypeDTO recipeType;

  @Schema(description = "Calificación promedio de la receta", example = "4.5")
  private Double averageRating;

  @Schema(description = "Lista de calificaciones asociadas a la receta")
  private List<RatingDTOReduced> ratings;

  @Schema(description = "Lista de ingredientes utilizados en la receta")
  private List<UsedIngredientDTO> usedIngredients;

  @Schema(description = "Lista de pasos para preparar la receta")
  private List<StepDTO> steps;

  @Schema(description = "Lista de fotos asociadas a la receta")
  private List<PhotoDTO> photos;

  @Schema(description = "Indica si la receta es favorita del usuario", example = "false")
  private boolean favorite;

  @Schema(description = "Indica si la receta está en recordatorio del usuario", example = "false")
  private boolean remindLater;

  public RecipeDTO(Recipe recipe, Principal principal) {
    this.id = recipe.getIdRecipe();
    this.isEnabled = recipe.getRecipeExtended().getIsEnabled();
    this.user = new UserDTOReduced(recipe.getUser());
    this.recipeName = recipe.getRecipeName();
    this.recipeDescription = recipe.getRecipeDescription();
    this.mainPhoto = recipe.getMainPhoto();
    this.servings = recipe.getServings();
    this.numberOfPeople = recipe.getNumberOfPeople();
    this.cookingTime = recipe.getRecipeExtended().getCookingTime();
    this.recipeType = new RecipeTypeDTO(recipe.getRecipeType());
    this.averageRating = Math.round(
      recipe.getRatings().stream()
      .mapToInt(Rating::getRating)
      .average()
      .orElse(0.0) * 100.0
    ) / 100.0;
    this.ratings = recipe.getRatings().stream()
      .filter(rating -> rating.getRatingExtended().getIsEnabled() ||
        (principal != null && rating.getUser().getEmail().equals(principal.getName())))
      .map(RatingDTOReduced::new)
      .toList();
    this.usedIngredients = recipe.getUsedIngredients().stream()
      .map(UsedIngredientDTO::new)
      .toList();
    this.steps = recipe.getSteps().stream()
      .map(StepDTO::new)
      .toList();
    this.photos = recipe.getPhotos().stream()
      .map(PhotoDTO::new)
      .toList();
    this.favorite = recipe.getUsersWhoFavorited() != null && recipe.getUsersWhoFavorited().stream()
      .anyMatch(r -> principal != null && r.getUser().getEmail().equals(principal.getName()));
    this.remindLater = recipe.getUsersToRemind() != null && recipe.getUsersToRemind().stream()
      .anyMatch(r -> principal != null && r.getUser().getEmail().equals(principal.getName()));
  }
}
