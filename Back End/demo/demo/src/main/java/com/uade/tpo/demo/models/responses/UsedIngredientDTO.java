package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.UsedIngredient;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa un ingrediente utilizado en una receta.")
public class UsedIngredientDTO {

  @Schema(description = "Identificador único del ingrediente utilizado", example = "1")
  private Integer idUsedIngredient;

  @Schema(description = "Identificador de la receta asociada", example = "100")
  private Integer idRecipe;

  @Schema(description = "Id del ingrediente", example = "1")
  private Integer ingredientId;

  @Schema(description = "Nombre del ingrediente", example = "Harina")
  private String ingredientName;

  @Schema(description = "Cantidad del ingrediente utilizado", example = "500")
  private Integer quantity;

  @Schema(description = "Id de la unidad de medida", example = "1")
  private Integer unitId;

  @Schema(description = "Descripción de la unidad de medida", example = "Gramos")
  private String unitDescription;

  @Schema(description = "Observaciones adicionales sobre el ingrediente", example = "Usar harina sin gluten")
  private String observations;

  public UsedIngredientDTO(UsedIngredient usedIngredient) {
    this.idUsedIngredient = usedIngredient.getIdUsedIngredient();
    this.idRecipe = usedIngredient.getRecipe().getIdRecipe();
    this.ingredientId = usedIngredient.getIngredient().getIdIngredient();
    this.ingredientName = usedIngredient.getIngredient().getName();
    this.quantity = usedIngredient.getQuantity();
    this.unitId = usedIngredient.getUnit().getIdUnit();
    this.unitDescription = usedIngredient.getUnit().getDescription();
    this.observations = usedIngredient.getObservations();
  }
  
}
