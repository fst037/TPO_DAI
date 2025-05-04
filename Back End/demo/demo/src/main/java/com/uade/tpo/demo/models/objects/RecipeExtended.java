package com.uade.tpo.demo.models.objects;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Table(name = "recipe_extended") // New table for additional fields
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeExtended {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_recipe_extended")
  private Integer idRecipeExtended;

  @OneToOne
  @JoinColumn(name = "id_recipe", referencedColumnName = "idReceta", nullable = false)
  private Recipe recipe;

  @Column(name = "is_enabled")
  private Boolean isEnabled;

  @Column(name = "created_at", nullable = false)
  private String createdAt;

  @Column(name = "cooking_time")
  private Integer cookingTime;
}