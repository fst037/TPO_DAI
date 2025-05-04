package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar un paso de una receta")
public class StepRequest {

    @Schema(description = "Texto descriptivo del paso", example = "Precalentar el horno a 180 grados", required = true)
    private String text;
}
