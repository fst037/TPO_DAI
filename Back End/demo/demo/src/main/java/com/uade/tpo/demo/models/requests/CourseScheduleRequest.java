package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar un cronograma de curso")
public class CourseScheduleRequest {

  @Schema(description = "ID del curso asociado", example = "1", required = true)
  private Integer courseId;

  @Schema(description = "ID de la sede asociada", example = "2", required = true)
  private Integer branchId;

  @Schema(description = "Fecha de inicio del curso (formato YYYY-MM-DD)", example = "2023-11-01", required = true)
  private String startDate;

  @Schema(description = "Fecha de finalización del curso (formato YYYY-MM-DD)", example = "2023-12-15", required = true)
  private String endDate;

  @Schema(description = "Cantidad de vacantes disponibles", example = "20", required = true)
  private Integer availableSlots;

  @Schema(description = "Nombre del profesor", example = "Juan Pérez", required = true)
  private String professorName;
  
  @Schema(description = "Foto del profesor", example = "https://example.com/photo.jpg", required = true)
  private String professorPhoto;

  @Schema(description = "Lista de fechas del curso", example = "[\"2023-11-01\", \"2023-11-08\", \"2023-11-15\"]", required = true)
  private String[] courseDates;
}
