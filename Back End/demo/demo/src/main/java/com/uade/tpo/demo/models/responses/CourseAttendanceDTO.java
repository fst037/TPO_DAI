package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.CourseAttendance;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Objeto de transferencia de datos que representa una asistencia a un curso.")
public class CourseAttendanceDTO {

  @Schema(description = "Identificador único de la asistencia", example = "1")
  public Integer idAttendance;

  @Schema(description = "Identificador del alumno asociado a la asistencia", example = "101")
  public Integer idStudent;

  @Schema(description = "Identificador del cronograma de curso asociado", example = "202")
  public Integer idCourseSchedule;

  @Schema(description = "Fecha de la asistencia en formato ISO 8601", example = "2023-11-01")
  public String date;

  public CourseAttendanceDTO(CourseAttendance courseAttendance) {
    this.idAttendance = courseAttendance.getIdAttendance();
    this.idStudent = courseAttendance.getStudent().getIdStudent();
    this.idCourseSchedule = courseAttendance.getCourseSchedule().getIdCourseSchedule();
    this.date = courseAttendance.getDate().toString();
  }

}
