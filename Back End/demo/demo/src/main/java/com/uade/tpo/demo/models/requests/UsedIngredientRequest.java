package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar un ingrediente utilizado en una receta")
public class UsedIngredientRequest {

  @Schema(description = "Cantidad del ingrediente utilizado", example = "2", required = true)
  private Integer quantity;

  @Schema(description = "Observaciones sobre el ingrediente utilizado", example = "Cortar en rodajas finas", required = false)
  private String observations;

  @Schema(description = "ID del ingrediente", example = "1", required = true)
  private Long ingredientId;

  @Schema(description = "ID de la unidad de medida", example = "3", required = true)
  private Integer unitId;
}
