package com.uade.tpo.demo.models.responses;

import java.util.List;

import com.uade.tpo.demo.models.objects.Course;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa un curso.")
public class CourseDTO {
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

  @Schema(description = "Lista de cronogramas de cursos asociados")
  private List<CourseScheduleDTOReduced> courseSchedules;

  public CourseDTO(Course course) {
    this.id = course.getIdCourse();
    this.description = course.getDescription();
    this.contents = course.getContents();
    this.requirements = course.getRequirements();
    this.duration = course.getDuration();
    this.price = course.getPrice();
    this.modality = course.getModality();
    this.courseSchedules = course.getCourseSchedules().stream()
        .map(CourseScheduleDTOReduced::new)
        .toList();
  }
}
