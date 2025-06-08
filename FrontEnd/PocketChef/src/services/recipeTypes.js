import { NoAuth } from './api';

// Get all recipe types
export const getAllRecipeTypes = async () => NoAuth('/recipeTypes/');

// Get recipe type by ID
export const getRecipeTypeById = async (id) => NoAuth(`/recipeTypes/${id}`);
