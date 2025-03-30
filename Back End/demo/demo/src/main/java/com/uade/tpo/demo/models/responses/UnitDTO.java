package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.Unit;

import lombok.Data;

@Data
public class UnitDTO {
  private Integer id;
  private String description;

  public UnitDTO(Unit unit) {
    this.id = unit.getIdUnit();
    this.description = unit.getDescription();
  }  
}
