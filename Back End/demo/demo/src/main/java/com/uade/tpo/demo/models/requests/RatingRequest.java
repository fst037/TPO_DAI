package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar una calificación")
public class RatingRequest {

    @Schema(description = "Calificación otorgada", example = "5", required = true)
    private Integer rating;

    @Schema(description = "Comentarios adicionales sobre la calificación", example = "Excelente servicio", required = true)
    private String comments;
}
