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
  @Column(name = "idReceta")
  private Integer idRecipe;

  @ManyToOne
  @JoinColumn(name = "idUsuario")
  private User user;

  @Column(name = "nombreReceta", length = 500)
  private String recipeName;

  @Column(name = "descripcionReceta", length = 1000)
  private String recipeDescription;

  @Column(name = "fotoPrincipal")
  private String mainPhoto;

  @Column(name = "porciones")
  private Integer servings;

  @Column(name = "cantidadPersonas")
  private Integer numberOfPeople;

  @ManyToOne
  @JoinColumn(name = "idTipo")
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
  
  @ManyToMany(mappedBy = "remindLaterRecipes")
  private List<UserExtended> usersToRemind;
}