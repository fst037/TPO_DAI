package com.uade.tpo.demo.models;

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
}
