package com.uade.tpo.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.models.requests.IngredientRequest;
import com.uade.tpo.demo.models.responses.IngredientDTO;
import com.uade.tpo.demo.service.IngredientService;

@RestController
@RequestMapping("/ingredients")
public class IngredientController {
  
  @Autowired
  private IngredientService ingredientService;

  @GetMapping("/")
  public ResponseEntity<Object> getAllIngredients() {
    try {
      return ResponseEntity.ok(ingredientService.getAllIngredients().stream().map(IngredientDTO::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<Object> getIngredientById(@PathVariable Long id) {
    try {
      return ResponseEntity.ok(new IngredientDTO(ingredientService.getIngredientById(id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/")
  public ResponseEntity<Object> createIngredient(@RequestBody IngredientRequest ingredientRequest) {
    try {
      return ResponseEntity.ok(new IngredientDTO(ingredientService.createIngredient(ingredientRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Object> updateIngredient(@PathVariable Long id, @RequestBody IngredientRequest ingredientRequest) {
    try {
      return ResponseEntity.ok(new IngredientDTO(ingredientService.updateIngredient(id, ingredientRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Object> deleteIngredient(@PathVariable Long id) {
    try {
      ingredientService.deleteIngredient(id);
      return ResponseEntity.ok("Ingredient deleted successfully.");
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
