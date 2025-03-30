package com.uade.tpo.demo.models.responses;


import com.uade.tpo.demo.models.objects.UsedIngredient;

import lombok.Data;

@Data
public class UsedIngredientDTO {

  private Integer idUsedIngredient;
  private Integer idRecipe;
  private String ingredientName;
  private Integer quantity;
  private String unitDescription;
  private String observations;

  public UsedIngredientDTO(UsedIngredient usedIngredient) {
    this.idUsedIngredient = usedIngredient.getIdUsedIngredient();
    this.idRecipe = usedIngredient.getRecipe().getIdRecipe();
    this.ingredientName = usedIngredient.getIngredient().getName();
    this.quantity = usedIngredient.getQuantity();
    this.unitDescription = usedIngredient.getUnit().getDescription();
    this.observations = usedIngredient.getObservations();
  }
  
}
