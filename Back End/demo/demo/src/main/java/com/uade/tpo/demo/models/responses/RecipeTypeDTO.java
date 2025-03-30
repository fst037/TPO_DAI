package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.RecipeType;

import lombok.Data;

@Data
public class RecipeTypeDTO {
  private Integer id;
  private String description;

  public RecipeTypeDTO(RecipeType recipeType) {
    this.id = recipeType.getIdType();
    this.description = recipeType.getDescription();
  }
}
