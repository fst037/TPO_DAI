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
  @Column(name = "idConversion")
  private Integer idConversion;

  @ManyToOne
  @JoinColumn(name = "idUnidadOrigen")
  private Unit originUnit;

  @ManyToOne
  @JoinColumn(name = "idUnidadDestino")
  private Unit destinationUnit;

  @Column(name = "factorConversiones")
  private Float conversionFactor;
}