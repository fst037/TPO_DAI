package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.SavedRecipe;

import lombok.Data;

@Data
public class SavedRecipeDTO {
    private Integer idSavedRecipe;
    private UserDTOReduced user;
    private RecipeDTOReduced recipe;

    public SavedRecipeDTO(SavedRecipe savedRecipe) {
        this.idSavedRecipe = savedRecipe.getIdSavedRecipe();
        this.user = new UserDTOReduced(savedRecipe.getUser());
        this.recipe = new RecipeDTOReduced(savedRecipe.getRecipe());
    }
}
