package com.uade.tpo.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.uade.tpo.demo.models.objects.SavedRecipe;

public interface SavedRecipeRepository extends JpaRepository<SavedRecipe, Long>{
    @Query("SELECT sr FROM SavedRecipe sr WHERE sr.user.email = ?1")
    List<SavedRecipe> findByUserEmail(String userEmail);

    @Query("SELECT COUNT(sr) > 0 FROM SavedRecipe sr WHERE sr.user.email = :userEmail AND sr.recipe.id = :recipeId")
    boolean existsByUserEmailAndRecipeId(String userEmail, Long recipeId);
}
