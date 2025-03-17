package com.uade.tpo.demo.models;

import java.util.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "asistenciaCursos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsistenciaCurso {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idAsistencia;

  @ManyToOne
  @JoinColumn(name = "idAlumno", nullable = false)
  private Alumno alumno;

  @ManyToOne
  @JoinColumn(name = "idCronograma", nullable = false)
  private CronogramaCurso cronograma;

  private Date fecha;
}