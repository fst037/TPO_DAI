package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.Course;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos reducido que representa un curso.")
public class CourseDTOReduced {
  @Schema(description = "Identificador único del curso", example = "1")
  private Integer id;

  @Schema(description = "Descripción del curso", example = "Curso de cocina de pastas artesanales")
  private String description;

  @Schema(description = "Contenidos del curso", example = "Preparación de masa, Técnicas de amasado, Recetas de salsas")
  private String contents;

  @Schema(description = "Requerimientos para tomar el curso", example = "Interés en la cocina, utensilios básicos")
  private String requirements;

  @Schema(description = "Duración del curso en horas", example = "20")
  private Integer duration;

  @Schema(description = "Precio del curso", example = "500.00")
  private Double price;

  @Schema(description = "Modalidad del curso", example = "Presencial")
  private String modality;

  public CourseDTOReduced(Course course) {
    this.id = course.getIdCourse();
    this.description = course.getDescription();
    this.contents = course.getContents();
    this.requirements = course.getRequirements();
    this.duration = course.getDuration();
    this.price = course.getPrice();
    this.modality = course.getModality();
  }
}
