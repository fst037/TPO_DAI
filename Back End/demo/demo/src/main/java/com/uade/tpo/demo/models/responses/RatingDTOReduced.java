package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.Rating;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos reducido que representa una calificación.")
public class RatingDTOReduced {
  @Schema(description = "Identificador único de la calificación", example = "1")
  private Integer id;

  @Schema(description = "Usuario que realizó la calificación")
  private UserDTOReduced user;

  @Schema(description = "Valor numérico de la calificación", example = "5")
  private Integer rating;

  @Schema(description = "Comentarios adicionales de la calificación", example = "Muy buena receta")
  private String comments;

  @Schema(description = "Identificador de la receta asociada a la calificación", example = "100")
  private Integer recipeId;

  @Schema(description = "Fecha de creación de la calificación", example = "2023-01-01T12:00:00Z")
  private String createdAt;

  public RatingDTOReduced(Rating rating) {
    this.id = rating.getIdRating();
    this.user = new UserDTOReduced(rating.getUser());
    this.rating = rating.getRating();
    this.comments = rating.getComments();
    this.recipeId = rating.getRecipe().getIdRecipe();
    this.createdAt = rating.getRatingExtended().getCreatedAt();
  }
}
