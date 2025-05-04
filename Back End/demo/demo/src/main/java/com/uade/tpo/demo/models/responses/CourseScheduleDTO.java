package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.CourseSchedule;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa un cronograma de curso.")
public class CourseScheduleDTO {
  @Schema(description = "Identificador único del cronograma de curso", example = "1")
  private Integer id;

  @Schema(description = "Sede asociada al cronograma")
  private BranchDTOReduced branch;

  @Schema(description = "Curso asociado al cronograma")
  private CourseDTOReduced course;

  @Schema(description = "Fecha de inicio del curso (formato YYYY-MM-DD)", example = "2023-11-01")
  private String startDate;

  @Schema(description = "Fecha de finalización del curso (formato YYYY-MM-DD)", example = "2023-12-15")
  private String endDate;

  @Schema(description = "Cantidad de vacantes disponibles", example = "20")
  private Integer availableSlots;

  @Schema(description = "Cantidad de estudiantes inscritos", example = "15")
  private Integer enrolledStudents;

  public CourseScheduleDTO(CourseSchedule courseSchedule) {
    this.id = courseSchedule.getIdCourseSchedule();
    this.branch = new BranchDTOReduced(courseSchedule.getBranch());
    this.course = new CourseDTOReduced(courseSchedule.getCourse());
    this.startDate = courseSchedule.getStartDate().toString();
    this.endDate = courseSchedule.getEndDate().toString();
    this.availableSlots = courseSchedule.getAvailableSlots();
    this.enrolledStudents = courseSchedule.getStudentsInscribed().size();
  }
}
