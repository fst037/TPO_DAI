package com.uade.tpo.demo.service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.Ingredient;
import com.uade.tpo.demo.models.objects.MultimediaContent;
import com.uade.tpo.demo.models.objects.Photo;
import com.uade.tpo.demo.models.objects.Rating;
import com.uade.tpo.demo.models.objects.RatingExtended;
import com.uade.tpo.demo.models.objects.Recipe;
import com.uade.tpo.demo.models.objects.RecipeExtended;
import com.uade.tpo.demo.models.objects.Step;
import com.uade.tpo.demo.models.objects.Unit;
import com.uade.tpo.demo.models.objects.UsedIngredient;
import com.uade.tpo.demo.models.objects.User;
import com.uade.tpo.demo.models.requests.MultimediaContentRequest;
import com.uade.tpo.demo.models.requests.PhotoRequest;
import com.uade.tpo.demo.models.requests.RatingRequest;
import com.uade.tpo.demo.models.requests.RecipeFilterRequest;
import com.uade.tpo.demo.models.requests.RecipeRequest;
import com.uade.tpo.demo.models.requests.StepRequest;
import com.uade.tpo.demo.models.requests.UsedIngredientRequest;
import com.uade.tpo.demo.repository.RecipeRepository;

@Service
public class RecipeService {

  @Autowired
  private RecipeRepository recipeRepository;

  @Autowired
  private RecipeTypeService recipeTypeService;

  @Autowired
  private UserService userService;
  
  @Autowired
  private IngredientService ingredientService;
  
  @Autowired
  private UnitService unitService;
  
  public List<Recipe> getAllRecipes(Principal principal) {
    return recipeRepository.findAll().stream()
        .filter(recipe -> 
          recipe.getRecipeExtended().getIsEnabled() ||
          recipe.getUser().getEmail().equals(principal.getName()) ||
          principal.getName().equals("admin@gmail.com")
        )
        .toList();
  }

  public List<Recipe> getLastAddedRecipes(Principal principal) {
    return recipeRepository.findAll().stream()
      .filter(recipe -> 
        recipe.getRecipeExtended().getIsEnabled() ||
        recipe.getUser().getEmail().equals(principal.getName()) ||
        principal.getName().equals("admin@gmail.com")
      )
      .sorted((recipe1, recipe2) -> recipe2.getRecipeExtended().getCreatedAt().compareTo(recipe1.getRecipeExtended().getCreatedAt()))
      .limit(3)
      .toList();
  }

  public List<Recipe> getFilteredRecipes(Principal principal, RecipeFilterRequest recipeFilterRequest) {
    return recipeRepository.findFilteredRecipes(
        recipeFilterRequest.getRecipeName(), 
        recipeFilterRequest.getRecipeTypeId(),
        recipeFilterRequest.getUserId(),
        recipeFilterRequest.getUsedIngredientIds(),
        recipeFilterRequest.getExcludedIngredientIds()
      ).stream()
      .filter(recipe -> 
        recipe.getRecipeExtended().getIsEnabled() ||
        recipe.getUser().getEmail().equals(principal.getName()) ||
        principal.getName().equals("admin@gmail.com")
      )
      .sorted((recipe1, recipe2) -> {
        if (recipeFilterRequest.getOrderByAge() != null && recipeFilterRequest.getOrderByAge()) {
          return recipe1.getRecipeExtended().getCreatedAt().compareTo(recipe2.getRecipeExtended().getCreatedAt());
        } else {
          return recipe1.getRecipeName().compareTo(recipe2.getRecipeName());
        }
      })
      .toList();
    }

  public Recipe getRecipeById(Principal principal, Long id) {
    Recipe recipe = recipeRepository.findById(id).orElseThrow();
  if (
    !recipe.getRecipeExtended().getIsEnabled() &&
    !recipe.getUser().getEmail().equals(principal.getName()) &&
    !principal.getName().equals("admin@gmail.com")
  ) {
    System.out.println(    principal.getName().equals("admin@gmail.com"));
    throw new RuntimeException("La receta no está habilitada.");
  }
  return recipe;
  }

  public List<Recipe> getRecipesOfUser(Principal principal, String userEmail) {
    return recipeRepository.findByUserEmail(userEmail).stream()
        .filter(recipe -> 
          recipe.getRecipeExtended().getIsEnabled() ||
          recipe.getUser().getEmail().equals(principal.getName()) ||
          principal.getName().equals("admin@gmail.com")
        )
        .toList();
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
    recipe.setRecipeExtended(RecipeExtended.builder()
        .isEnabled(false)
        .cookingTime(recipeRequest.getCookingTime())
        .createdAt(LocalDateTime.now().toString())
        .recipe(recipe)
        .build()
    );

    return recipeRepository.save(recipe);
  }

  
  public Recipe enableRecipe(Long recipeId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    recipe.getRecipeExtended().setIsEnabled(true);

    return recipeRepository.save(recipe);
  }

  public Recipe disableRecipe(Long recipeId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    recipe.getRecipeExtended().setIsEnabled(false);

    return recipeRepository.save(recipe);
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
    recipe.getRecipeExtended().setCookingTime(recipeRequest.getCookingTime());

    return recipeRepository.save(recipe);
  }

  public void deleteRecipe(String userEmail, Long id) {
    Recipe recipe = recipeRepository.findById(id).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para eliminar esta receta.");
    }
    recipeRepository.deleteById(id);
  }

  public Recipe addPhotoToRecipe(String userEmail, Long recipeId, PhotoRequest photoRequest) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para agregar fotos a esta receta.");
    }

    Photo photo = new Photo();
    photo.setRecipe(recipe);
    photo.setPhotoUrl(photoRequest.getPhotoUrl());
    photo.setExtension(photoRequest.getExtension());

    recipe.getPhotos().add(photo);

    return recipeRepository.save(recipe);
  }

  public Recipe removePhotoFromRecipe(String userEmail, Long recipeId, Integer photoId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para eliminar fotos de esta receta.");
    }

    recipe.getPhotos().removeIf(photo -> photo.getIdPhoto().equals(photoId));

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

  public Recipe addIngredientToRecipe(String userEmail, Long recipeId, UsedIngredientRequest usedIngredientRequest) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para agregar ingredientes a esta receta.");
    }

    Ingredient ingredient = ingredientService.getIngredientById(usedIngredientRequest.getIngredientId());
    Unit unit = unitService.getUnitById(usedIngredientRequest.getUnitId());

    UsedIngredient usedIngredient = new UsedIngredient();
    usedIngredient.setRecipe(recipe);
    usedIngredient.setIngredient(ingredient);
    usedIngredient.setQuantity(usedIngredientRequest.getQuantity());
    usedIngredient.setUnit(unit);
    usedIngredient.setObservations(usedIngredientRequest.getObservations());
    
    recipe.getUsedIngredients().add(usedIngredient);
    return recipeRepository.save(recipe);
  }
  
  public Recipe updateIngredientInRecipe(String userEmail, Long recipeId, Integer usedIngredientId, UsedIngredientRequest usedIngredientRequest) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para modificar ingredientes de esta receta.");
    }
  
    UsedIngredient usedIngredient = recipe.getUsedIngredients().stream()
        .filter(ui -> ui.getIdUsedIngredient().equals(usedIngredientId))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Ingrediente no encontrado."));
    
    Ingredient ingredient = ingredientService.getIngredientById(usedIngredientRequest.getIngredientId());
    Unit unit = unitService.getUnitById(usedIngredientRequest.getUnitId());
  
    usedIngredient.setQuantity(usedIngredientRequest.getQuantity());
    usedIngredient.setIngredient(ingredient);
    usedIngredient.setUnit(unit);
    usedIngredient.setObservations(usedIngredientRequest.getObservations());
  
    return recipeRepository.save(recipe);
  }
  
  public Recipe removeIngredientFromRecipe(String userEmail, Long recipeId, Integer usedIngredientId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No tienes permiso para eliminar ingredientes de esta receta.");
    }

    recipe.getUsedIngredients().removeIf(ui -> ui.getIdUsedIngredient().equals(usedIngredientId));

    return recipeRepository.save(recipe);
  }

  public Recipe addRatingToRecipe(String userEmail, Long recipeId, RatingRequest ratingRequest) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getRecipeExtended().getIsEnabled()) {
      throw new RuntimeException("La receta no está habilitada.");
    }
    User user = userService.getUserByEmail(userEmail).orElseThrow();

    if (recipe.getUser().getEmail().equals(userEmail)) {
      throw new RuntimeException("No puedes agregar una valoración a una receta que te pertenece.");
    }

    if (recipe.getRatings().stream().anyMatch(r -> r.getUser().getEmail().equals(userEmail))) {
      throw new RuntimeException("Ya has valorado esta receta.");
    }

    Rating rating = new Rating();
    rating.setRecipe(recipe);
    rating.setUser(user);
    rating.setRating(ratingRequest.getRating());
    rating.setComments(ratingRequest.getComments());
    rating.setRatingExtended(RatingExtended.builder()
        .createdAt(LocalDateTime.now().toString())
        .isEnabled(false)
        .rating(rating)
        .build()
    );

    recipe.getRatings().add(rating);
    return recipeRepository.save(recipe);
  }

  public Recipe enableRating(Long recipeId, Integer ratingId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getRecipeExtended().getIsEnabled()) {
      throw new RuntimeException("La receta no está habilitada.");
    }

    Rating rating = recipe.getRatings().stream()
        .filter(r -> r.getIdRating().equals(ratingId))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Valoración no encontrada."));
    
    rating.getRatingExtended().setIsEnabled(true);
    return recipeRepository.save(recipe);
  }

  public Recipe removeRatingFromRecipe(String userEmail, Long recipeId, Integer ratingId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getRecipeExtended().getIsEnabled()) {
      throw new RuntimeException("La receta no está habilitada.");
    }

    if (!recipe.getRatings().stream().anyMatch(r -> r.getIdRating().equals(ratingId))) {
      throw new RuntimeException("No puedes eliminar una valoración que no existe.");
    }

    if (!recipe.getRatings().stream().anyMatch(r -> r.getUser().getEmail().equals(userEmail))) {
      throw new RuntimeException("No puedes eliminar una valoración que no te pertenece.");
    }

    recipe.getRatings().removeIf(r -> r.getIdRating().equals(ratingId));
    return recipeRepository.save(recipe);
  }

  public User addRecipeToFavorites(String userEmail, Long recipeId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getRecipeExtended().getIsEnabled()) {
      throw new RuntimeException("La receta no está habilitada.");
    }
    User user = userService.getUserByEmail(userEmail).orElseThrow();

    if (user.getUserExtended().getFavoriteRecipes().contains(recipe)) {
      throw new RuntimeException("La receta ya está en tus favoritos.");
    }

    user.getUserExtended().getFavoriteRecipes().add(recipe);
    userService.saveUser(user);

    return user;
  }

  public User removeRecipeFromFavorites(String userEmail, Long recipeId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getRecipeExtended().getIsEnabled()) {
      throw new RuntimeException("La receta no está habilitada.");
    }
    User user = userService.getUserByEmail(userEmail).orElseThrow();

    if (!user.getUserExtended().getFavoriteRecipes().contains(recipe)) {
      throw new RuntimeException("La receta no está en tus favoritos.");
    }

    user.getUserExtended().getFavoriteRecipes().remove(recipe);
    userService.saveUser(user);

    return user;
  }

  public User addRecipeToRemindLater (String userEmail, Long recipeId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getRecipeExtended().getIsEnabled()) {
      throw new RuntimeException("La receta no está habilitada.");
    }
    User user = userService.getUserByEmail(userEmail).orElseThrow();

    if (user.getUserExtended().getRemindLaterRecipes().contains(recipe)) {
      throw new RuntimeException("La receta ya está en tus recordatorios.");
    }

    user.getUserExtended().getRemindLaterRecipes().add(recipe);
    userService.saveUser(user);

    return user;
  }

  public User removeRecipeFromRemindLater (String userEmail, Long recipeId) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    if (!recipe.getRecipeExtended().getIsEnabled()) {
      throw new RuntimeException("La receta no está habilitada.");
    }
    User user = userService.getUserByEmail(userEmail).orElseThrow();

    if (!user.getUserExtended().getRemindLaterRecipes().contains(recipe)) {
      throw new RuntimeException("La receta no está en tus recordatorios.");
    }

    user.getUserExtended().getRemindLaterRecipes().remove(recipe);
    userService.saveUser(user);

    return user;
  }

}
