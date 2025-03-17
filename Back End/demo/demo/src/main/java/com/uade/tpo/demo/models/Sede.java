package com.uade.tpo.demo.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sedes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sede {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idSede;

  @Column(nullable = false, length = 150)
  private String nombreSede;

  @Column(nullable = false, length = 250)
  private String direccionSede;

  @Column(length = 15)
  private String telefonoSede;

  @Column(length = 150)
  private String mailSede;

  @Column(length = 15)
  private String whatsApp;

  @Column(length = 20)
  private String tipoBonificacion;

  private Double bonificacionCursos;

  @Column(length = 20)
  private String tipoPromocion;

  private Double promocionCursos;
}
