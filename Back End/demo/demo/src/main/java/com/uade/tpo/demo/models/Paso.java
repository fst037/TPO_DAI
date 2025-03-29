package com.uade.tpo.demo.models;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pasos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paso {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idPaso;

  @ManyToOne
  @JoinColumn(name = "idReceta")
  private Receta receta;

  private Integer nroPaso;

  @OneToMany(mappedBy = "paso", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Multimedia> multimedia;

  @Column(length = 4000)
  private String texto;
}
