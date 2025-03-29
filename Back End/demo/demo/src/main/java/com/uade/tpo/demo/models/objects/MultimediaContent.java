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
  @Column(name = "idContenido") // Map to the Spanish column name
  private Integer idContent;

  @ManyToOne
  @JoinColumn(name = "idPaso", nullable = false) // Keep the column name in Spanish
  private Step step;

  @Column(name = "tipoContenido", length = 10) // Map to the Spanish column name
  private String contentType;

  @Column(name = "extension") // Map to the Spanish column name
  private String extension;

  @Column(name = "urlContenido") // Map to the Spanish column name
  private String contentUrl;
}