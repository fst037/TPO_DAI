package com.uade.tpo.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.models.objects.RecipeType;

@Repository
public interface RecipeTypeRepository extends JpaRepository<RecipeType, Integer> {


}
