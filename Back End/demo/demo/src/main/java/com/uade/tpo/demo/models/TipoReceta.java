package com.uade.tpo.demo.models;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tiposReceta")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoReceta {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idTipo;

  @Column(length = 250)
  private String descripcion;

  @OneToMany(mappedBy = "tipo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Receta> recetas;
}
