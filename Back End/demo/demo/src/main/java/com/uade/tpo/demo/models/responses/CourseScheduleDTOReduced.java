package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.CourseSchedule;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos reducido que representa un cronograma de curso.")
public class CourseScheduleDTOReduced {  
  @Schema(description = "Identificador único del cronograma de curso", example = "1")
  private Integer id;

  @Schema(description = "Identificador de la sede asociada", example = "2")
  private Integer branchId;

  @Schema(description = "Identificador del curso asociado", example = "3")
  private Integer courseId;

  @Schema(description = "Fecha de inicio del curso (formato YYYY-MM-DD)", example = "2023-11-01")
  private String startDate;

  @Schema(description = "Fecha de finalización del curso (formato YYYY-MM-DD)", example = "2023-12-15")
  private String endDate;

  @Schema(description = "Cantidad de vacantes disponibles", example = "20")
  private Integer availableSlots;

  @Schema(description = "Cantidad de alumnos inscritos", example = "15")
  private Integer enrolledStudents;
  
  public CourseScheduleDTOReduced(CourseSchedule courseSchedule) {
    this.id = courseSchedule.getIdCourseSchedule();
    this.branchId = courseSchedule.getBranch().getIdBranch();
    this.courseId = courseSchedule.getCourse().getIdCourse();
    this.startDate = courseSchedule.getStartDate().toString();
    this.endDate = courseSchedule.getEndDate().toString();
    this.availableSlots = courseSchedule.getAvailableSlots();
    this.enrolledStudents = courseSchedule.getStudentsEnrolled().size();
  }
}
