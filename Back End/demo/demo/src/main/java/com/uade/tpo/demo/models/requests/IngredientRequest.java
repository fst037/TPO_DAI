package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar un ingrediente")
public class IngredientRequest {

  @Schema(description = "Nombre del ingrediente", example = "Tomate", required = true)
  private String name;  
}
