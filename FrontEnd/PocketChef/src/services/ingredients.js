import { NoAuth } from './api';

// Get all ingredients
export const getAllIngredients = async () => NoAuth('/ingredients/');

// Get ingredient by ID
export const getIngredientById = async (id) => NoAuth(`/ingredients/${id}`);
