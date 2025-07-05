package com.uade.tpo.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.models.objects.Recipe;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {
  
  @Query("SELECT r FROM Recipe r WHERE r.user.email = ?1")
  List<Recipe> findByUserEmail(String userEmail);

  @Query("SELECT r FROM Recipe r WHERE r.recipeName = ?1")
  List<Recipe> findByRecipeName(String recipeName);

  @Query("SELECT r FROM Recipe r " +
      "WHERE (:recipeName IS NULL OR LOWER(r.recipeName) LIKE %:recipeName%) " +
      "AND (:recipeTypeId IS NULL OR r.recipeType.id = :recipeTypeId) " +
      "AND (:nickname IS NULL OR LOWER(r.user.nickname)  LIKE %:nickname%) " +
      "AND (:usedIngredientIds IS NULL OR " +
      "  (SELECT COUNT(i) FROM r.usedIngredients i WHERE i.ingredient.id IN :usedIngredientIds) = :usedIngredientCount) " +
      "AND (:excludedIngredientIds IS NULL OR " +
      "  (SELECT COUNT(i) FROM r.usedIngredients i WHERE i.ingredient.id IN :excludedIngredientIds) = 0)")
  List<Recipe> findFilteredRecipes(
    String recipeName,
    Integer recipeTypeId,
    String nickname,
    List<Integer> usedIngredientIds,
    Integer usedIngredientCount,
    List<Integer> excludedIngredientIds);
  
}
