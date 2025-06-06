import { NoAuth } from './api';

// Get all units
export const getAllUnits = async () => NoAuth('/units/');

// Get unit by ID
export const getUnitById = async (id) => NoAuth(`/units/${id}`);
