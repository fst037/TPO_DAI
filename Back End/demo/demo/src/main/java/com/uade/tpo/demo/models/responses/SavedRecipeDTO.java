package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.SavedRecipe;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa una receta guardada por un usuario.")
public class SavedRecipeDTO {
    @Schema(description = "Identificador único de la receta guardada", example = "1")
    private Integer idSavedRecipe;

    @Schema(description = "Usuario que guardó la receta")
    private UserDTOReduced user;

    @Schema(description = "Receta guardada")
    private RecipeDTOReduced recipe;

    public SavedRecipeDTO(SavedRecipe savedRecipe) {
        this.idSavedRecipe = savedRecipe.getIdSavedRecipe();
        this.user = new UserDTOReduced(savedRecipe.getUser());
        this.recipe = new RecipeDTOReduced(savedRecipe.getRecipe());
    }
}
