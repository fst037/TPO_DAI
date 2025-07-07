package com.uade.tpo.demo.models.requests;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Solicitud para filtrar cursos")
public class CourseFilterRequest {
  @Schema(description = "Nombre del curso para filtrar", example = "Curso de cocina", required = false)
  private String courseName;

  @Schema(description = "Modalidad del curso", example = "Presencial", required = false)
  private String modality;

  @Schema(description = "Lista de IDs de sucursales para filtrar cursos", example = "[1, 2, 3]", required = false)
  private List<Integer> branchIds;

  @Schema(description = "Fecha mínima de inicio del curso (formato YYYY-MM-DD)", example = "2023-01-01", required = false)
  private String minStartDate;

  @Schema(description = "Fecha máxima de finalización del curso (formato YYYY-MM-DD)", example = "2023-12-31", required = false)
  private String maxEndDate;

  @Schema(description = "Precio mínimo del curso", example = "100.00", required = false)
  private Double minPrice;

  @Schema(description = "Precio máximo del curso", example = "500.00", required = false)
  private Double maxPrice;

  @Schema(description = "Duración mínima del curso en horas", example = "10", required = false)
  private Integer minDuration;

  @Schema(description = "Duración máxima del curso en horas", example = "50", required = false)
  private Integer maxDuration;

}
