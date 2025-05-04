package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.RecipeType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa un tipo de receta.")
public class RecipeTypeDTO {
  @Schema(description = "Identificador único del tipo de receta", example = "1")
  private Integer id;

  @Schema(description = "Descripción del tipo de receta", example = "Postre")
  private String description;

  public RecipeTypeDTO(RecipeType recipeType) {
    this.id = recipeType.getIdType();
    this.description = recipeType.getDescription();
  }
}
