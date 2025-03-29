package com.uade.tpo.demo.models.objects;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "conversiones") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnitConversion {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idConversion") // Map to the Spanish column name
  private Integer idConversion;

  @ManyToOne
  @JoinColumn(name = "idUnidadOrigen") // Keep the column name in Spanish
  private Unit originUnit;

  @ManyToOne
  @JoinColumn(name = "idUnidadDestino") // Keep the column name in Spanish
  private Unit destinationUnit;

  @Column(name = "factorConversiones") // Map to the Spanish column name
  private Float conversionFactor;
}