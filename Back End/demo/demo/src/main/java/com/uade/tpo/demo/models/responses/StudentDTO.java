package com.uade.tpo.demo.models.responses;

import java.util.List;

import com.uade.tpo.demo.models.objects.Student;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Objeto de transferencia de datos que representa un alumno.")
public class StudentDTO {

  @Schema(description = "Número de tarjeta del alumno", example = "****-****-****-3456")
  public String cardNumber;

  @Schema(description = "Tipo de tarjeta del alumno", example = "Visa")
  public String cardType;

  @Schema(description = "Nombre del titular de la tarjeta", example = "Juan Pérez")
  public String cardName;

  @Schema(description = "Saldo actual del alumno", example = "1500.50")
  public Double balance;

  @Schema(description = "Lista de asistencias a cursos del alumno")
  public List<CourseAttendanceDTO> courseAttendances;

  @Schema(description = "Lista de cursos actuales del alumno")
  public List<CourseScheduleDTO> currentCourses;

  @Schema(description = "Lista de cursos finalizados del alumno")
  public List<CourseScheduleDTO> finishedCourses;

  public StudentDTO(Student student) {
    // El cardNumber ya viene enmascarado desde la BD
    this.cardNumber = student.getCardNumber();
    this.cardType = student.getCardType();
    this.cardName = student.getStudentExtended().getCardName();
    this.balance = student.getBalance();
    this.courseAttendances = student.getCourseAttendances().stream()
        .map(CourseAttendanceDTO::new)
        .toList();
    this.currentCourses = student.getStudentExtended().getCurrentCourses().stream()
        .map(CourseScheduleDTO::new)
        .toList();
    this.finishedCourses = student.getStudentExtended().getFinishedCourses().stream()
        .map(CourseScheduleDTO::new)
        .toList();
  }
}
