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
  @Column(name = "idUtilizado") // Map to the Spanish column name
  private Integer idUsedIngredient;

  @ManyToOne
  @JoinColumn(name = "idReceta") // Keep the column name in Spanish
  private Recipe recipe;

  @ManyToOne
  @JoinColumn(name = "idIngrediente") // Keep the column name in Spanish
  private Ingredient ingredient;

  @Column(name = "cantidad") // Map to the Spanish column name
  private Integer quantity;

  @ManyToOne
  @JoinColumn(name = "idUnidad") // Keep the column name in Spanish
  private Unit unit;

  @Column(name = "observaciones", length = 500) // Map to the Spanish column name
  private String observations;
}