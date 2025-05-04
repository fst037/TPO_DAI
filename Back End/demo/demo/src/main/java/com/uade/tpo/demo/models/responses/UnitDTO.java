package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.Unit;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa una unidad de medida.")
public class UnitDTO {
  @Schema(description = "Identificador único de la unidad de medida", example = "1")
  private Integer id;

  @Schema(description = "Descripción de la unidad de medida", example = "Gramos")
  private String description;

  public UnitDTO(Unit unit) {
    this.id = unit.getIdUnit();
    this.description = unit.getDescription();
  }  
}
