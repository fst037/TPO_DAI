package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.Ingredient;

import lombok.Data;

@Data
public class IngredientDTO {
  private Integer id;
  private String name;

  public IngredientDTO(Ingredient ingredient) {
    this.id = ingredient.getIdIngredient();
    this.name = ingredient.getName();
  }
}
