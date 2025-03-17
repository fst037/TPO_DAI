package com.uade.tpo.demo.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "multimedia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Multimedia {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idContenido;

  @ManyToOne
  @JoinColumn(name = "idPaso", nullable = false)
  private Paso paso;

  @Column(length = 10)
  private String tipoContenido;

  private String extension;
  private String urlContenido;
}
