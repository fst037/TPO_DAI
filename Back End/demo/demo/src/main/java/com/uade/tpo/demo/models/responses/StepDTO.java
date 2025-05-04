package com.uade.tpo.demo.models.responses;

import java.util.List;

import com.uade.tpo.demo.models.objects.Step;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa un paso de una receta.")
public class StepDTO {
  @Schema(description = "Identificador único del paso", example = "1")
  private Integer id;

  @Schema(description = "Identificador de la receta asociada al paso", example = "100")
  private Integer recipeId;

  @Schema(description = "Número del paso en la receta", example = "1")
  private Integer stepNumber;

  @Schema(description = "Texto descriptivo del paso", example = "Precalentar el horno a 180 grados.")
  private String text;

  @Schema(description = "Lista de contenido multimedia asociado al paso")
  private List<MultimediaContentDTO> multimedia;

  public StepDTO(Step step) {
    this.id = step.getIdStep();
    this.recipeId = step.getRecipe().getIdRecipe();
    this.stepNumber = step.getStepNumber();
    this.text = step.getText();
    this.multimedia = step.getMultimedia().stream()
        .map(MultimediaContentDTO::new)
        .toList();
  }
}
