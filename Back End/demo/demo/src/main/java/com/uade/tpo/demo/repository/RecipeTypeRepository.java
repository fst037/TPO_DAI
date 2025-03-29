package com.uade.tpo.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.demo.models.objects.RecipeType;

public interface RecipeTypeRepository extends JpaRepository<RecipeType, Integer> {

  Optional<RecipeType> findById(Integer id);
  Optional<RecipeType> findByDescription(String description);

}
