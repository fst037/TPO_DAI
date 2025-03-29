package com.uade.tpo.demo.models;

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
}
