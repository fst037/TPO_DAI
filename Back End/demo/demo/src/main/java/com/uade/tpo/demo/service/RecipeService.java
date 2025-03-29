package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.Recipe;
import com.uade.tpo.demo.models.requests.RecipyRequest;
import com.uade.tpo.demo.repository.RecipeRepository;

@Service
public class RecipeService {

  @Autowired
  private RecipeRepository recipeRepository;

  public List<Recipe> getRecipiesOfUser(String userEmail) {
    return recipeRepository.findByUserEmail(userEmail);
  }

  public Recipe createRecipy(String userEmail, RecipyRequest recipyRequest) {
    Recipe recipe = new Recipe();
    return recipeRepository.save(recipe);
  }
  
}
