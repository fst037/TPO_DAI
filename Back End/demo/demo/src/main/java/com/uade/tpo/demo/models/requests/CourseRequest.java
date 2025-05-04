package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar un curso")
public class CourseRequest {

  @Schema(description = "Descripción del curso", example = "Curso de cocina de pastas artesanales", required = true)
  private String description;

  @Schema(description = "Contenidos del curso", example = "Preparación de masa, Técnicas de amasado, Recetas de salsas", required = true)
  private String contents;

  @Schema(description = "Requerimientos para tomar el curso", example = "Interés en la cocina, utensilios básicos", required = false)
  private String requirements;

  @Schema(description = "Duración del curso en horas", example = "20", required = true)
  private Integer duration;

  @Schema(description = "Precio del curso", example = "500.00", required = true)
  private Double price;

  @Schema(description = "Modalidad del curso", example = "Presencial", required = true)
  private String modality;
}
