package com.uade.tpo.demo.models.responses;

import java.util.List;

import com.uade.tpo.demo.models.objects.Step;

import lombok.Data;

@Data
public class StepDTO {
  private Integer id;
  private Integer recipeId;
  private Integer stepNumber;
  private String text;
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
