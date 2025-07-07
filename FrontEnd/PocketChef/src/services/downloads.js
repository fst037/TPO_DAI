import AsyncStorage from '@react-native-async-storage/async-storage';

const DOWNLOADS_KEY = 'downloaded_recipes';

// Convert image URL to base64
const imageToBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

// Download and save a recipe for offline use
export const downloadRecipe = async (recipe) => {
  try {
    // Deep clone the recipe
    const recipeToStore = JSON.parse(JSON.stringify(recipe));

    // Convert main photo to base64 if it exists
    if (recipeToStore.mainPhoto) {
      const base64Image = await imageToBase64(recipeToStore.mainPhoto);
      if (base64Image) {
        recipeToStore.mainPhoto = base64Image;
      }
    }

    // Convert recipe photos to base64
    if (recipeToStore.photos && Array.isArray(recipeToStore.photos)) {
      for (const photo of recipeToStore.photos) {
        if (photo.photoUrl) {
          const base64Image = await imageToBase64(photo.photoUrl);
          if (base64Image) {
            photo.photoUrl = base64Image;
          }
        }
      }
    }

    // Convert step multimedia to base64
    if (recipeToStore.steps && Array.isArray(recipeToStore.steps)) {
      for (const step of recipeToStore.steps) {
        if (step.multimedia && Array.isArray(step.multimedia)) {
          for (const media of step.multimedia) {
            if (media.contentUrl) {
              const base64Image = await imageToBase64(media.contentUrl);
              if (base64Image) {
                media.contentUrl = base64Image;
              }
            }
          }
        }
      }
    }

    // Convert user avatar to base64
    if (recipeToStore.user?.avatar) {
      const base64Image = await imageToBase64(recipeToStore.user.avatar);
      if (base64Image) {
        recipeToStore.user.avatar = base64Image;
      }
    }

    // Get existing downloads
    const existingDownloads = await getDownloadedRecipes();
    
    // Add timestamp
    recipeToStore.downloadedAt = new Date().toISOString();
    
    // Check if recipe already exists (update if it does)
    const existingIndex = existingDownloads.findIndex(r => r.id === recipe.id);
    if (existingIndex !== -1) {
      existingDownloads[existingIndex] = recipeToStore;
    } else {
      existingDownloads.push(recipeToStore);
    }

    // Save to AsyncStorage
    await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(existingDownloads));
    
    return true;
  } catch (error) {
    console.error('Error downloading recipe:', error);
    throw error;
  }
};

// Get all downloaded recipes
export const getDownloadedRecipes = async () => {
  try {
    const downloads = await AsyncStorage.getItem(DOWNLOADS_KEY);
    return downloads ? JSON.parse(downloads) : [];
  } catch (error) {
    console.error('Error getting downloaded recipes:', error);
    return [];
  }
};

// Get a specific downloaded recipe by ID
export const getDownloadedRecipeById = async (id) => {
  try {
    const downloads = await getDownloadedRecipes();
    const recipe = downloads.find(r => r.id === parseInt(id) || r.id === String(id));
    if (!recipe) {
      return undefined;
    }
    return recipe;
  } catch (error) {
    console.error('Error getting downloaded recipe by ID:', error);
    throw error;
  }
};

// Remove a downloaded recipe
export const removeDownloadedRecipe = async (id) => {
  try {
    const downloads = await getDownloadedRecipes();
    const filteredDownloads = downloads.filter(r => r.id !== parseInt(id) && r.id !== String(id));
    await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(filteredDownloads));
    return true;
  } catch (error) {
    console.error('Error removing downloaded recipe:', error);
    throw error;
  }
};

// Check if a recipe is downloaded
export const isRecipeDownloaded = async (id) => {
  try {
    const downloads = await getDownloadedRecipes();
    return downloads.some(r => r.id === parseInt(id) || r.id === String(id));
  } catch (error) {
    console.error('Error checking if recipe is downloaded:', error);
    return false;
  }
};

// Clear all downloads
export const clearAllDownloads = async () => {
  try {
    await AsyncStorage.removeItem(DOWNLOADS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing downloads:', error);
    throw error;
  }
};
