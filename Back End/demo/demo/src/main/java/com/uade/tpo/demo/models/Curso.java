package com.uade.tpo.demo.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cursos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Curso {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idCurso;

  @Column(length = 300)
  private String descripcion;

  @Column(length = 500)
  private String contenidos;

  @Column(length = 500)
  private String requerimientos;

  private Integer duracion;
  private Double precio;

  @Column(length = 20)
  private String modalidad;

  @OneToMany(mappedBy = "curso", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private java.util.List<CronogramaCurso> cronogramasCursos;
}
