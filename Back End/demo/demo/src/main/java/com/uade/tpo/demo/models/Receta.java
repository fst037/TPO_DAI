package com.uade.tpo.demo.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recetas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Receta {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idReceta;

  @ManyToOne
  @JoinColumn(name = "idUsuario")
  private Usuario usuario;

  @Column(length = 500)
  private String nombreReceta;

  @Column(length = 1000)
  private String descripcionReceta;

  private String fotoPrincipal;
  private Integer porciones;
  private Integer cantidadPersonas;

  @ManyToOne
  @JoinColumn(name = "idTipo")
  private TipoReceta tipo;
}
