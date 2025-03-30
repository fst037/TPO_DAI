package com.uade.tpo.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.models.objects.Recipe;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
  
  @Query("SELECT r FROM Recipe r WHERE r.user.email = ?1")
  List<Recipe> findByUserEmail(String userEmail);

  
}
