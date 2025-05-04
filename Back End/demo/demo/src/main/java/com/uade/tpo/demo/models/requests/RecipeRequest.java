package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar una receta")
public class RecipeRequest {

  @Schema(description = "Nombre de la receta", example = "Tarta de manzana", required = true)
  private String recipeName;

  @Schema(description = "Descripción de la receta", example = "Una deliciosa tarta de manzana casera", required = true)
  private String recipeDescription;

  @Schema(description = "URL de la foto principal de la receta", example = "https://example.com/photo.jpg", required = true)
  private String mainPhoto;

  @Schema(description = "Cantidad de porciones que rinde la receta", example = "4", required = true)
  private Integer servings;

  @Schema(description = "Número de personas para las que está diseñada la receta", example = "4", required = true)
  private Integer numberOfPeople;

  @Schema(description = "ID del tipo de receta", example = "2", required = true)
  private Integer recipeTypeId;

  @Schema(description = "Tiempo de cocción en minutos", example = "45", required = true)
  public Integer cookingTime;
}
