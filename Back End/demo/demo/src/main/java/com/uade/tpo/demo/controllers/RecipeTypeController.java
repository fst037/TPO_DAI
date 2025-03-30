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

import com.uade.tpo.demo.models.requests.RecipeTypeRequest;
import com.uade.tpo.demo.models.responses.RecipeTypeDTO;
import com.uade.tpo.demo.service.RecipeTypeService;

@RestController
@RequestMapping("/recipeTypes")
public class RecipeTypeController {

  @Autowired
  private RecipeTypeService recipeTypeService;

  @GetMapping("/")
  public ResponseEntity<Object> getAllRecipeTypes() {
    try {
      return ResponseEntity.ok(recipeTypeService.getAllRecipeTypes().stream().map(RecipeTypeDTO::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<Object> getRecipeTypeById(@PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new RecipeTypeDTO(recipeTypeService.getRecipeTypeById(id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/")
  public ResponseEntity<Object> createRecipeType(@RequestBody RecipeTypeRequest recipeTypeRequest) {
    try {
      return ResponseEntity.ok(new RecipeTypeDTO(recipeTypeService.createRecipeType(recipeTypeRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Object> updateRecipeType(@PathVariable Integer id, @RequestBody RecipeTypeRequest recipeTypeRequest) {
    try {
      return ResponseEntity.ok(new RecipeTypeDTO(recipeTypeService.updateRecipeType(id, recipeTypeRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Object> deleteRecipeType(@PathVariable Integer id) {
    try {
      recipeTypeService.deleteRecipeType(id);
      return ResponseEntity.ok("Recipe type deleted successfully");
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

}
