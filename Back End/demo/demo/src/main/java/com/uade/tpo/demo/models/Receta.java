package com.uade.tpo.demo.models;

import java.util.List;

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

  @OneToMany(mappedBy = "receta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Calificacion> calificaciones;

  @OneToMany(mappedBy = "receta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Utilizado> utilizados;

  @OneToMany(mappedBy = "receta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Paso> pasos;

  @OneToMany(mappedBy = "receta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Foto> fotos;

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
