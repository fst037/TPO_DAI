package com.uade.tpo.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.models.objects.Ingredient;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

}
