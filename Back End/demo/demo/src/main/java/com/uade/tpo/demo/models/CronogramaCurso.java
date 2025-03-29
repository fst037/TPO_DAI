package com.uade.tpo.demo.models;

import java.util.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cronogramaCursos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CronogramaCurso {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idCronograma;

  @ManyToOne
  @JoinColumn(name = "idSede", nullable = false)
  private Sede sede;

  @ManyToOne
  @JoinColumn(name = "idCurso", nullable = false)
  private Curso curso;

  @OneToMany(mappedBy = "cronograma", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<AsistenciaCurso> asistenciasCursos;

  private Date fechaInicio;
  private Date fechaFin;
  private Integer vacantesDisponibles;
}