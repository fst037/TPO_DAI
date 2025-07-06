import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth, NoAuth } from './api';
import { isTokenExpired } from '../utils/jwt';

// Get all recipes
export const getAllRecipes = async () => NoAuth('/recipes/');

// Get recipe by ID
export const getRecipeById = async (id) => { 
  const loggedUserToken = await AsyncStorage.getItem('token');

  if (loggedUserToken && !isTokenExpired(loggedUserToken)) {
    return Auth(`/recipes/${id}`);
  }
  return NoAuth(`/recipes/${id}`)
};

// Get recipes created by the authenticated user
export const getMyRecipes = async () => Auth('/recipes/myRecipes');

// Get last added recipes
export const getLastAddedRecipes = async () => NoAuth('/recipes/lastAdded');

// Filter recipes
export const getFilteredRecipes = async (filter) => {
  const loggedUserToken = await AsyncStorage.getItem('token');

  if (loggedUserToken && !isTokenExpired(loggedUserToken)) {
    return Auth('/recipes/filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filter),
    });
  }

  return NoAuth('/recipes/filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filter),
  });
};

// Check if recipe name is available
export const isRecipeNameAvailable = async (name) => Auth(`/recipes/isNameAvaliable/${encodeURIComponent(name)}`);

// Create a new recipe
export const createRecipe = async (recipe) => Auth('/recipes/', {
  method: 'POST',
  body: JSON.stringify(recipe),
});

// Update a recipe
export const updateRecipe = async (id, recipe) => Auth(`/recipes/${id}`, {
  method: 'PUT',
  body: JSON.stringify(recipe),
});

// Delete a recipe
export const deleteRecipe = async (id) => Auth(`/recipes/${id}`, { method: 'DELETE' });

// Enable a recipe
export const enableRecipe = async (id) => Auth(`/recipes/enable/${id}`, { method: 'PUT' });

// Add ingredient to recipe
export const addIngredientToRecipe = async (id, ingredient) => Auth(`/recipes/${id}/addUsedIngredient`, {
  method: 'POST',
  body: JSON.stringify(ingredient),
});

// Update ingredient in recipe
export const updateIngredientInRecipe = async (id, usedIngredientId, ingredient) => Auth(`/recipes/${id}/updateUsedIngredient/${usedIngredientId}`, {
  method: 'PUT',
  body: JSON.stringify(ingredient),
});

// Remove ingredient from recipe
export const removeIngredientFromRecipe = async (id, usedIngredientId) => Auth(`/recipes/${id}/removeUsedIngredient/${usedIngredientId}`, { method: 'DELETE' });

// Add step to recipe
export const addStepToRecipe = async (id, step) => Auth(`/recipes/${id}/addStep`, {
  method: 'POST',
  body: JSON.stringify(step),
});

// Update step in recipe
export const updateStepInRecipe = async (id, stepId, step) => Auth(`/recipes/${id}/updateStep/${stepId}`, {
  method: 'PUT',
  body: JSON.stringify(step),
});

// Remove step from recipe
export const removeStepFromRecipe = async (id, stepId) => Auth(`/recipes/${id}/removeStep/${stepId}`, { method: 'DELETE' });

// Add rating to recipe
export const addRatingToRecipe = async (id, rating) => Auth(`/recipes/${id}/addRating`, {
  method: 'POST',
  body: JSON.stringify(rating),
});

// Enable rating in recipe
export const enableRating = async (id, ratingId) => Auth(`/recipes/${id}/enableRating/${ratingId}`, { method: 'PUT' });

// Remove rating from recipe
export const removeRatingFromRecipe = async (id, ratingId) => Auth(`/recipes/${id}/removeRating/${ratingId}`, { method: 'DELETE' });

// Add photo to recipe
export const addPhotoToRecipe = async (id, photo) => Auth(`/recipes/${id}/addPhoto`, {
  method: 'POST',
  body: JSON.stringify(photo),
});

// Remove photo from recipe
export const removePhotoFromRecipe = async (id, photoId) => Auth(`/recipes/${id}/removePhoto/${photoId}`, { method: 'DELETE' });

// Add multimedia to step
export const addMultimediaToStep = async (id, stepId, multimedia) => Auth(`/recipes/${id}/updateStep/${stepId}/addMultimedia`, {
  method: 'POST',
  body: JSON.stringify(multimedia),
});

// Remove multimedia from step
export const removeMultimediaFromStep = async (id, stepId, multimediaId) => Auth(`/recipes/${id}/updateStep/${stepId}/removeMultimedia/${multimediaId}`, { method: 'DELETE' });

// Add recipe to favorites
export const addRecipeToFavorites = async (id) => Auth(`/recipes/${id}/addToFavorites`, { method: 'POST' });

// Remove recipe from favorites
export const removeRecipeFromFavorites = async (id) => Auth(`/recipes/${id}/removeFromFavorites`, { method: 'DELETE' });

// Add recipe to remind later
export const addRecipeToRemindLater = async (id) => Auth(`/recipes/${id}/addToRemindLater`, { method: 'POST' });

// Remove recipe from remind later
export const removeRecipeFromRemindLater = async (id) => Auth(`/recipes/${id}/removeFromRemindLater`, { method: 'DELETE' });
