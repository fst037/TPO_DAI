package com.uade.tpo.demo.models.requests;

import java.util.List;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecipeFilterRequest {
  private String recipeName;
  private Integer recipeTypeId;
  private Integer userId;
  private List<Integer> usedIngredientIds;
  private List<Integer> excludedIngredientIds;
  private Boolean orderByAge;
}
