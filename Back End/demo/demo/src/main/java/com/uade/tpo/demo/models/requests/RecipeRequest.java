package com.uade.tpo.demo.models.requests;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecipeRequest {
  private String recipeName;
  private String recipeDescription;
  private String mainPhoto;
  private Integer servings;
  private Integer numberOfPeople;
  private Integer recipeTypeId;
}
