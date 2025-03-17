package com.uade.tpo.demo.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "conversiones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conversion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idConversion;

  @ManyToOne
  @JoinColumn(name = "idUnidadOrigen")
  private Unidad unidadOrigen;

  @ManyToOne
  @JoinColumn(name = "idUnidadDestino")
  private Unidad unidadDestino;

  private Float factorConversiones;
}
