package com.uade.tpo.demo.models.objects;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fotos") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Photo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idFoto")
  private Integer idPhoto;

  @ManyToOne
  @JoinColumn(name = "idReceta", nullable = false)
  private Recipe recipe;

  @Column(name = "urlFoto")
  private String photoUrl;

  @Column(name = "extension")
  private String extension;
}