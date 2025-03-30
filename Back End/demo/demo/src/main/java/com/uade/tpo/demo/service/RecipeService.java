package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.MultimediaContent;
import com.uade.tpo.demo.models.objects.Recipe;
import com.uade.tpo.demo.models.objects.Step;
import com.uade.tpo.demo.models.requests.MultimediaContentRequest;
import com.uade.tpo.demo.models.requests.RecipeRequest;
import com.uade.tpo.demo.models.requests.StepRequest;
import com.uade.tpo.demo.repository.RecipeRepository;

@Service
public class RecipeService {

  @Autowired
  private RecipeRepository recipeRepository;

  @Autowired
  private RecipeTypeService recipeTypeService;

  @Autowired
  private UserService userService;

  
  public List<Recipe> getAllRecipes() {
    return recipeRepository.findAll();
  }

  public Recipe getRecipeById(Long id) {
    return recipeRepository.findById(id).orElseThrow();
  }

  public List<Recipe> getRecipesOfUser(String userEmail) {
    return recipeRepository.findByUserEmail(userEmail);
  }

  public Recipe createRecipe(String userEmail, RecipeRequest recipeRequest) {
    Recipe recipe = new Recipe();
    recipe.setUser(userService.getUserByEmail(userEmail).orElseThrow());
    recipe.setRecipeName(recipeRequest.getRecipeName());
    recipe.setRecipeDescription(recipeRequest.getRecipeDescription());
    recipe.setMainPhoto(recipeRequest.getMainPhoto());
    recipe.setServings(recipeRequest.getServings());
    recipe.setNumberOfPeople(recipeRequest.getNumberOfPeople());
    recipe.setRecipeType(recipeTypeService.getRecipeTypeById(recipeRequest.getRecipeTypeId()));
    recipe.setRatings(List.of());
    recipe.setUsedIngredients(List.of());
    recipe.setSteps(List.of());
    recipe.setPhotos(List.of());

    return recipeRepository.save(recipe);
  }

  public void deleteRecipe(String userEmail, Long id) {
    Recipe recipe = recipeRepository.findById(id).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para eliminar esta receta.");
    }
    recipeRepository.deleteById(id);
  }

  public Recipe updateRecipe(String userEmail, Long id, RecipeRequest recipeRequest) {
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

  public Recipe addStepToRecipe(String userEmail, Long recipeId, StepRequest stepRequest) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para agregar pasos a esta receta.");
    }

    Step step = new Step();
    step.setRecipe(recipe);
    step.setText(stepRequest.getText());
    step.setStepNumber(recipe.getSteps().size() + 1); // Set the step number to the next available number
    step.setMultimedia(List.of());

    recipe.getSteps().add(step);
    return recipeRepository.save(recipe);
  }

  public Recipe removeStepFromRecipe(String userEmail, Long recipeId, Integer stepId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para eliminar pasos de esta receta.");
    }

    recipe.getSteps().removeIf(step -> step.getIdStep().equals(stepId));

    // Reorder the steps after removal
    for (int i = 0; i < recipe.getSteps().size(); i++) {
      recipe.getSteps().get(i).setStepNumber(i + 1);
    }  

    return recipeRepository.save(recipe);
  }

  public Recipe updateStepInRecipe(String userEmail, Long recipeId, Integer stepId, StepRequest stepRequest) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para modificar pasos de esta receta.");
    }

    Step step = recipe.getSteps().stream()
        .filter(s -> s.getIdStep().equals(stepId))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Paso no encontrado."));
    step.setText(stepRequest.getText());

    return recipeRepository.save(recipe);
  }

  public Recipe addMultimediaToStep(String userEmail, Long recipeId, Integer stepId, MultimediaContentRequest multimediaContentRequest) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para agregar multimedia a esta receta.");
    }

    Step step = recipe.getSteps().stream()
        .filter(s -> s.getIdStep().equals(stepId))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Paso no encontrado."));

    MultimediaContent multimediaContent = new MultimediaContent();
    multimediaContent.setStep(step);
    multimediaContent.setContentType(multimediaContentRequest.getContentType());
    multimediaContent.setExtension(multimediaContentRequest.getExtension());
    multimediaContent.setContentUrl(multimediaContentRequest.getContentUrl());

    step.getMultimedia().add(multimediaContent);
    return recipeRepository.save(recipe);
  }

  public Recipe removeMultimediaFromStep(String userEmail, Long recipeId, Integer stepId, Integer multimediaId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para eliminar multimedia de esta receta.");
    }

    Step step = recipe.getSteps().stream()
        .filter(s -> s.getIdStep().equals(stepId))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Paso no encontrado."));

    step.getMultimedia().removeIf(m -> m.getIdContent().equals(multimediaId));

    return recipeRepository.save(recipe);
  }

}
