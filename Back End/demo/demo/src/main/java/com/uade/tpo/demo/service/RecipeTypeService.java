package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.RecipeType;
import com.uade.tpo.demo.models.requests.RecipeTypeRequest;
import com.uade.tpo.demo.repository.RecipeTypeRepository;

@Service
public class RecipeTypeService {

  @Autowired
  private RecipeTypeRepository recipeTypeRepository;

  public List<RecipeType> getAllRecipeTypes() {
    return recipeTypeRepository.findAll();
  }

  public RecipeType getRecipeTypeById(Integer id) {
    return recipeTypeRepository.findById(id).orElse(null);
  }
  
  public RecipeType getRecipeTypeByDescription(String description) {
    return recipeTypeRepository.findByDescription(description).orElse(null);
  }

  public RecipeType createRecipeType(RecipeTypeRequest recipeTypeRequest) {
    RecipeType recipeType = new RecipeType();
    recipeType.setDescription(recipeTypeRequest.getDescription());
    recipeType.setRecipes(List.of());
    return recipeTypeRepository.save(recipeType);
  }

  public RecipeType updateRecipeType(Integer id, RecipeTypeRequest recipeTypeRequest) {
    RecipeType recipeType = recipeTypeRepository.findById(id).orElseThrow();
    recipeType.setDescription(recipeTypeRequest.getDescription());
    return recipeTypeRepository.save(recipeType);
  }

  public void deleteRecipeType(Integer id) {
    recipeTypeRepository.deleteById(id);
  }  
}
