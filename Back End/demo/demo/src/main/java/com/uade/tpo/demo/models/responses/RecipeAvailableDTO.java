package com.uade.tpo.demo.models.responses;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos en respuesta a verificacion de existencia de receta con nombre.")
public class RecipeAvailableDTO {

  @Schema(description = "Identificador único de la receta existente", example = "1")
  private Integer id;

  @Schema(description = "Boolean que indica si la receta esta disponible", example = "true")
  private Boolean available;


  public RecipeAvailableDTO(Integer id, Boolean available) {
    this.id = id;
    this.available = available;
  }
}
