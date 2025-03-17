package com.uade.tpo.demo.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "calificaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Calificacion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idCalificacion;

  @ManyToOne
  @JoinColumn(name = "idUsuario")
  private Usuario usuario;

  @ManyToOne
  @JoinColumn(name = "idReceta")
  private Receta receta;

  private Integer calificacion;

  @Column(length = 500)
  private String comentarios;
}
