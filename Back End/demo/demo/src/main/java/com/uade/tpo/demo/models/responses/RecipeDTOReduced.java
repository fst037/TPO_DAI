package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.Recipe;

import lombok.Data;

@Data
public class RecipeDTOReduced {
  private Integer id;
  private Boolean isEnabled;
  private UserDTOReduced user;
  private String recipeName;
  private String recipeDescription;
  private String mainPhoto;
  private Integer servings;
  private Integer numberOfPeople;
  private Integer cookingTime;
  private RecipeTypeDTO recipeType;
  private Double averageRating;
  private Integer usedIngredientsCount;
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
        .mapToInt(rating -> rating.getRating())
        .average()
        .orElse(0.0f);
    this.usedIngredientsCount = recipe.getUsedIngredients().size();
    this.stepsCount = recipe.getSteps().size();
  }
}
