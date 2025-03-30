package com.uade.tpo.demo.models.responses;

import java.util.List;

import com.uade.tpo.demo.models.objects.Rating;
import com.uade.tpo.demo.models.objects.Recipe;

import lombok.Data;

@Data
public class RecipeDTO {
  private Integer id;
  private UserDTOReduced user;
  private String recipeName;
  private String recipeDescription;
  private String mainPhoto;
  private Integer servings;
  private Integer numberOfPeople;
  private RecipeTypeDTO recipeType;
  private Double averageRating;
  private List<RatingDTOReduced> ratings;
  private List<UsedIngredientDTO> usedIngredients;
  private List<StepDTO> steps;
  private List<PhotoDTO> photos;

  public RecipeDTO(Recipe recipe) {
    this.id = recipe.getIdRecipe();
    this.user = new UserDTOReduced(recipe.getUser());
    this.recipeName = recipe.getRecipeName();
    this.recipeDescription = recipe.getRecipeDescription();
    this.mainPhoto = recipe.getMainPhoto();
    this.servings = recipe.getServings();
    this.numberOfPeople = recipe.getNumberOfPeople();
    this.recipeType = new RecipeTypeDTO(recipe.getRecipeType());
    this.averageRating = recipe.getRatings().stream()
      .mapToInt(Rating::getRating)
      .average()
      .orElse(0.0f);
    this.ratings = recipe.getRatings().stream()
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
  }
}
