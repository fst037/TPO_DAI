package com.uade.tpo.demo.models.objects;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "unidades") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Unit {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idUnidad")
  private Integer idUnit;

  @Column(name = "descripcion", nullable = false, length = 50)
  private String description;

  @OneToMany(mappedBy = "unit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UsedIngredient> usedIngredients;

  @OneToMany(mappedBy = "originUnit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UnitConversion> originConversions;

  @OneToMany(mappedBy = "destinationUnit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UnitConversion> destinationConversions;
}