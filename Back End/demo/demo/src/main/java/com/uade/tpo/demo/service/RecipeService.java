package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.Recipe;
import com.uade.tpo.demo.models.objects.RecipeType;
import com.uade.tpo.demo.models.requests.RecipeRequest;
import com.uade.tpo.demo.repository.RecipeRepository;

@Service
public class RecipeService {

  @Autowired
  private RecipeRepository recipeRepository;

  @Autowired
  private RecipeTypeService recipeTypeService;

  @Autowired
  private UserService userService;

  public List<Recipe> getRecipiesOfUser(String userEmail) {
    return recipeRepository.findByUserEmail(userEmail);
  }

  public List<Recipe> getAllRecipies() {
    return recipeRepository.findAll();
  }

  public Recipe getRecipyById(Long id) {
    return recipeRepository.findById(id).orElseThrow();
  }

  public void deleteRecipy(Long id, String userEmail) {
    Recipe recipe = recipeRepository.findById(id).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para eliminar esta receta.");
    }
    recipeRepository.deleteById(id);
  }

  public Recipe updateRecipy(Long id, String userEmail, RecipeRequest recipeRequest) {
    Recipe recipe = recipeRepository.findById(id).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para modificar esta receta.");
    }
    recipe.setRecipeName(recipeRequest.getRecipeName());
    recipe.setRecipeDescription(recipeRequest.getRecipeDescription());
    recipe.setMainPhoto(recipeRequest.getMainPhoto());
    recipe.setServings(recipeRequest.getServings());
    recipe.setNumberOfPeople(recipeRequest.getNumberOfPeople());
    recipe.setRecipeType(recipeTypeService.getRecipeTypeById(recipeRequest.getRecipeTypeId()));

    return recipeRepository.save(recipe);
  }



  public Recipe createRecipy(String userEmail, RecipeRequest recipeRequest) {
    Recipe recipe = new Recipe();
    recipe.setUser(userService.getUserByEmail(userEmail).orElseThrow());
    recipe.setRecipeName(recipeRequest.getRecipeName());
    recipe.setRecipeDescription(recipeRequest.getRecipeDescription());
    recipe.setMainPhoto(recipeRequest.getMainPhoto());
    recipe.setServings(recipeRequest.getServings());
    recipe.setNumberOfPeople(recipeRequest.getNumberOfPeople());
    recipe.setRecipeType(recipeTypeService.getRecipeTypeById(recipeRequest.getRecipeTypeId()));

    return recipeRepository.save(recipe);
  }

  
}
