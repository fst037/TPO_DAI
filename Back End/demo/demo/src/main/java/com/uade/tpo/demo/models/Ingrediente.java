package com.uade.tpo.demo.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ingredientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingrediente {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idIngrediente;

  @Column(length = 200)
  private String nombre;
}
