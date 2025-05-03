package com.uade.tpo.demo.models.objects;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recetas") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idReceta") // Map to the Spanish column name
  private Integer idRecipe;

  @ManyToOne
  @JoinColumn(name = "idUsuario") // Keep the column name in Spanish
  private User user;

  @Column(name = "nombreReceta", length = 500) // Map to the Spanish column name
  private String recipeName;

  @Column(name = "descripcionReceta", length = 1000) // Map to the Spanish column name
  private String recipeDescription;

  @Column(name = "fotoPrincipal") // Map to the Spanish column name
  private String mainPhoto;

  @Column(name = "porciones") // Map to the Spanish column name
  private Integer servings;

  @Column(name = "cantidadPersonas") // Map to the Spanish column name
  private Integer numberOfPeople;

  @ManyToOne
  @JoinColumn(name = "idTipo") // Keep the column name in Spanish
  private RecipeType recipeType;

  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<Rating> ratings;

  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<UsedIngredient> usedIngredients;

  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<Step> steps;

  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<Photo> photos;

  @OneToOne(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private RecipeExtended recipeExtended;

  @ManyToMany(mappedBy = "favoriteRecipes")
  private List<UserExtended> usersWhoFavorited;
  
  @ManyToMany(mappedBy = "favoriteRecipes")
  private List<UserExtended> usersToRemind;
}