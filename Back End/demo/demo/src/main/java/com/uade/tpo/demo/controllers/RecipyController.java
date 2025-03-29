package com.uade.tpo.demo.controllers;
import com.uade.tpo.demo.models.requests.RecipyRequest;
import com.uade.tpo.demo.service.RecipeService;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/recipies")
public class RecipyController {

  @Autowired
  private RecipeService recipeService;

  @GetMapping("/myRecipies")
  public ResponseEntity<Object> getMyRecipies(Principal principal) {
    try {
      return ResponseEntity.ok(recipeService.getRecipiesOfUser(principal.getName()));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
  
  @PostMapping("/")
  public ResponseEntity<Object> createRecipy(Principal principal, @RequestBody RecipyRequest recipyRequest) {
    try {
      return ResponseEntity.ok(recipeService.createRecipy(principal.getName(), recipyRequest));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
