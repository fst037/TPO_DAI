package com.uade.tpo.demo.models.objects;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ingredientes") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idIngrediente") // Map to the Spanish column name
  private Integer idIngredient;

  @Column(name = "nombre", length = 200) // Map to the Spanish column name
  private String name;

  @OneToMany(mappedBy = "ingredient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UsedIngredient> usedIngredients;
}