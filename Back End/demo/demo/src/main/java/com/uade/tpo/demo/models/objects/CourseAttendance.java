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
  @Column(name = "idAsistencia") // Map to the Spanish column name
  private Integer idAttendance;

  @ManyToOne
  @JoinColumn(name = "idAlumno", nullable = false) // Keep the column name in Spanish
  private Student student;

  @ManyToOne
  @JoinColumn(name = "idCronograma", nullable = false) // Keep the column name in Spanish
  private CourseSchedule schedule;

  @Column(name = "fecha") // Map to the Spanish column name
  private Date date;
}