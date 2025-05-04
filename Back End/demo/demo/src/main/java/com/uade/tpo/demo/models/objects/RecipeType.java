package com.uade.tpo.demo.models.objects;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tiposReceta") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeType {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idTipo")
  private Integer idType;

  @Column(name = "descripcion", length = 250)
  private String description;

  @OneToMany(mappedBy = "recipeType", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Recipe> recipes;
}