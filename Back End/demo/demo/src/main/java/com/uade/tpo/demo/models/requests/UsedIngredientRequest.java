package com.uade.tpo.demo.models.requests;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsedIngredientRequest {
  private Integer quantity;
  private String observations;
  private Long ingredientId;
  private Integer unitId;
}
