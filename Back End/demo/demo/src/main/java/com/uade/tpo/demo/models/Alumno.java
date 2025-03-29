package com.uade.tpo.demo.models;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "alumnos")
public class Alumno {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idAlumno;
  
  private String numeroTarjeta;
  private String dniFrente;
  private String dniFondo;
  private String tramite;
  private Double cuentaCorriente;

  @OneToOne(mappedBy = "alumno", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "usuario_id", referencedColumnName = "idUsuario")
  private Usuario usuario;

  @OneToMany(mappedBy = "alumno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<AsistenciaCurso> asistenciasCursos;

}
