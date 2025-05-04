package com.uade.tpo.demo.models.objects;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilizados") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsedIngredient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idUtilizado")
  private Integer idUsedIngredient;

  @ManyToOne
  @JoinColumn(name = "idReceta")
  private Recipe recipe;

  @ManyToOne
  @JoinColumn(name = "idIngrediente")
  private Ingredient ingredient;

  @Column(name = "cantidad")
  private Integer quantity;

  @ManyToOne
  @JoinColumn(name = "idUnidad")
  private Unit unit;

  @Column(name = "observaciones", length = 500)
  private String observations;
}