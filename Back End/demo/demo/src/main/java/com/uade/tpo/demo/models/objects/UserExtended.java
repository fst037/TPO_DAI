package com.uade.tpo.demo.models.objects;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Table(name = "user_extended")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserExtended {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_user_extended")
  private Integer idUserExtended;

  @OneToOne
  @JoinColumn(name = "id_user", referencedColumnName = "idUsuario", nullable = false)
  private User user;

  @ManyToMany
  @JoinTable(
    name = "favorite_recipes", // Name of the join table
    joinColumns = @JoinColumn(name = "id_user_extended"), // Foreign key to UserExtended
    inverseJoinColumns = @JoinColumn(name = "id_recipe") // Foreign key to Recipe
  )
  private List<Recipe> favoriteRecipes;

  @ManyToMany
  @JoinTable(
    name = "remind_later_recipes", // Name of the join table
    joinColumns = @JoinColumn(name = "id_user_extended"), // Foreign key to UserExtended
    inverseJoinColumns = @JoinColumn(name = "id_recipe") // Foreign key to Recipe
  )
  private List<Recipe> remindLaterRecipes;
}
