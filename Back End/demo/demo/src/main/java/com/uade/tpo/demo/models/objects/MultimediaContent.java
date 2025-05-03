package com.uade.tpo.demo.models.objects;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "multimedia") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MultimediaContent {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idContenido")
  private Integer idContent;

  @ManyToOne
  @JoinColumn(name = "idPaso", nullable = false)
  private Step step;

  @Column(name = "tipoContenido", length = 10)
  private String contentType;

  @Column(name = "extension")
  private String extension;

  @Column(name = "urlContenido")
  private String contentUrl;
}