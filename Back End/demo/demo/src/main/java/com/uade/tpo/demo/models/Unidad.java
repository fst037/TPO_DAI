package com.uade.tpo.demo.models;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "unidades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Unidad {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idUnidad;

  @Column(nullable = false, length = 50)
  private String descripcion;

  @OneToMany(mappedBy = "unidad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Utilizado> utilizados;

  @OneToMany(mappedBy = "unidadOrigen", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Conversion> conversionesOrigen;
  
  @OneToMany(mappedBy = "unidadDestino", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Conversion> conversionesDestino;
}
