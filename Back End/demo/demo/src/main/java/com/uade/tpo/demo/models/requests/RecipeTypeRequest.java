package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar un tipo de receta")
public class RecipeTypeRequest {

    @Schema(description = "Descripción del tipo de receta", example = "Postre", required = true)
    private String description;  
}
