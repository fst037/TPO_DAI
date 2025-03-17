package com.uade.tpo.demo.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilizados")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilizado {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idUtilizado;

  @ManyToOne
  @JoinColumn(name = "idReceta")
  private Receta receta;

  @ManyToOne
  @JoinColumn(name = "idIngrediente")
  private Ingrediente ingrediente;

  private Integer cantidad;

  @ManyToOne
  @JoinColumn(name = "idUnidad")
  private Unidad unidad;

  @Column(length = 500)
  private String observaciones;
}
