package com.uade.tpo.demo.service;

import java.security.Principal;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.Recipe;
import com.uade.tpo.demo.models.objects.SavedRecipe;
import com.uade.tpo.demo.models.objects.User;
import com.uade.tpo.demo.repository.SavedRecipeRepository;

@Service
public class SavedRecipeService {
    @Autowired
    private SavedRecipeRepository savedRecipeRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private RecipeService recipeService;

    public List<SavedRecipe> getSavedRecipesOfUser(String userEmail) {
        List<SavedRecipe> savedRecipes = savedRecipeRepository.findByUserEmail(userEmail);

        if (savedRecipes == null) {
            return Collections.emptyList();
        } else {
            return savedRecipes;
        }
    }

    public String saveRecipe(Principal principal, Integer recipeId) {
        User user = userService.getUserByEmail(principal.getName()).orElseThrow();
        Recipe recipe = recipeService.getRecipeById(principal, recipeId);

        if (!savedRecipeRepository.existsByUserEmailAndRecipeId(principal.getName(), recipeId)) {
            SavedRecipe savedRecipe = new SavedRecipe();
            savedRecipe.setUser(user);
            savedRecipe.setRecipe(recipe);
            savedRecipeRepository.save(savedRecipe);
            return "Receta guardada.";
        } else {
            return "La receta ya fue guardada previamente.";
        }
    }

    public void deleteSavedRecipe(String userEmail, Integer savedRecipeId) {
        SavedRecipe savedRecipe = savedRecipeRepository.findById(savedRecipeId)
                .orElseThrow(() -> new RuntimeException("La receta guardada no existe."));
    
        if (!savedRecipe.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("No tienes permiso para eliminar esta receta guardada.");
        }
        savedRecipeRepository.deleteById(savedRecipeId);
    }
}
