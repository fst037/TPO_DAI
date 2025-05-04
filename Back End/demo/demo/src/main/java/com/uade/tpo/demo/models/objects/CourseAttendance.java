package com.uade.tpo.demo.models.objects;

import java.util.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "asistenciaCursos") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseAttendance {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idAsistencia")
  private Integer idAttendance;

  @ManyToOne
  @JoinColumn(name = "idAlumno", nullable = false)
  private Student student;

  @ManyToOne
  @JoinColumn(name = "idCronograma", nullable = false)
  private CourseSchedule courseSchedule;

  @Column(name = "fecha")
  private Date date;
}