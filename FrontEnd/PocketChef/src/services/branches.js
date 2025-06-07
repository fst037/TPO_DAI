import { NoAuth } from './api';

// Get all branches
export const getAllBranches = async () => NoAuth('/branches/');

// Get branch by ID
export const getBranchById = async (id) => NoAuth(`/branches/${id}`);
