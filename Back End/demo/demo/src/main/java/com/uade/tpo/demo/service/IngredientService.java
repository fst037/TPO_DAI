package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.Ingredient;
import com.uade.tpo.demo.models.requests.IngredientRequest;
import com.uade.tpo.demo.repository.IngredientRepository;

@Service
public class IngredientService {
  
  @Autowired
  private IngredientRepository ingredientRepository;

  public List<Ingredient> getAllIngredients() {
    return ingredientRepository.findAll();
  }

  public Ingredient getIngredientById(Long id) {
    return ingredientRepository.findById(id).orElseThrow(() -> new RuntimeException("Ingredient not found"));
  }

  public Ingredient createIngredient(IngredientRequest ingredientRequest) {
    Ingredient ingredient = new Ingredient();
    ingredient.setName(ingredientRequest.getName());
    return ingredientRepository.save(ingredient);
  }

  public Ingredient updateIngredient(Long id, IngredientRequest ingredientRequest) {
    Ingredient ingredient = ingredientRepository.findById(id).orElseThrow(() -> new RuntimeException("Ingredient not found"));
    ingredient.setName(ingredientRequest.getName());
    return ingredientRepository.save(ingredient);
  }

  public void deleteIngredient(Long id) {
    ingredientRepository.deleteById(id);
  }
}
