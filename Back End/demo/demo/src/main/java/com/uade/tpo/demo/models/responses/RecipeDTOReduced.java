package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.Recipe;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos reducido que representa una receta.")
public class RecipeDTOReduced {
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

  @Schema(description = "Cantidad de ingredientes utilizados en la receta", example = "5")
  private Integer usedIngredientsCount;

  @Schema(description = "Cantidad de pasos en la receta", example = "10")
  private Integer stepsCount;

  public RecipeDTOReduced(Recipe recipe) {
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
    this.averageRating = recipe.getRatings().stream()    
        .filter(rating -> rating.getRatingExtended().getIsEnabled())
        .mapToInt(rating -> rating.getRating())
        .average()
        .orElse(0.0f);
    this.usedIngredientsCount = recipe.getUsedIngredients().size();
    this.stepsCount = recipe.getSteps().size();
  }
}
