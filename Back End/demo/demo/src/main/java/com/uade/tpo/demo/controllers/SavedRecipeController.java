package com.uade.tpo.demo.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.models.responses.SavedRecipeDTO;
import com.uade.tpo.demo.service.SavedRecipeService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/savedRecipes")
public class SavedRecipeController {
    @Autowired
    private SavedRecipeService savedRecipeService;

    @GetMapping("/mySavedRecipes")
    public ResponseEntity<Object> getMySavedRecipes(Principal principal) {
        try {
            return ResponseEntity.ok(savedRecipeService.getSavedRecipesOfUser(principal.getName()).stream().map(SavedRecipeDTO::new).toList());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> saveRecipe(Principal principal, @PathVariable Integer id) {
        try {
            return ResponseEntity.ok(savedRecipeService.saveRecipe(principal, id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSavedRecipe(Principal principal, @PathVariable Integer id){
        try {
            savedRecipeService.deleteSavedRecipe(principal.getName(), id);
            return ResponseEntity.ok("Recipe eliminada.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

}
