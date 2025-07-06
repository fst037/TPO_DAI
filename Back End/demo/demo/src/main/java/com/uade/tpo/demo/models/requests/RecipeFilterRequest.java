package com.uade.tpo.demo.models.requests;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para filtrar recetas")
public class RecipeFilterRequest {

  @Schema(description = "Nombre de la receta para filtrar", example = "Tarta de manzana", required = false)
  private String recipeName;

  @Schema(description = "ID del tipo de receta", example = "2", required = false)
  private Integer recipeTypeId;

  @Schema(description = "Nickname del usuario que creó la receta", example = "juanp", required = false)
  private String nickname;

  @Schema(description = "Lista de IDs de ingredientes utilizados", example = "[1, 2, 3]", required = false)
  private List<Integer> usedIngredientIds;

  @Schema(description = "Lista de IDs de ingredientes excluidos", example = "[4, 5]", required = false)
  private List<Integer> excludedIngredientIds;

  @Schema(description = "Ordenar por antigüedad de la receta", example = "true", required = false)
  private Boolean orderByAge;
}
