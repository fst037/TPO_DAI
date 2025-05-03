package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.Ingredient;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa un ingrediente")
public class IngredientDTO {
  @Schema(description = "Identificador único del ingrediente", example = "1")
  private Integer id;

  @Schema(description = "Nombre del ingrediente", example = "Tomate")
  private String name;

  public IngredientDTO(Ingredient ingredient) {
    this.id = ingredient.getIdIngredient();
    this.name = ingredient.getName();
  }
}
