package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar una unidad de medida")
public class UnitRequest {
    
  @Schema(description = "Descripción de la unidad de medida", example = "gramos", required = true)
  private String description;  
}
