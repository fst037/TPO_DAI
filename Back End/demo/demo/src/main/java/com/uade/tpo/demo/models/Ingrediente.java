package com.uade.tpo.demo.models;

import java.util.List;

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

  @OneToMany(mappedBy = "ingrediente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Utilizado> utilizados;
}
