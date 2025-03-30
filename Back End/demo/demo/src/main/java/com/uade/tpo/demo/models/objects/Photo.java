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
  @Column(name = "idFoto") // Map to the Spanish column name
  private Integer idPhoto;

  @ManyToOne
  @JoinColumn(name = "idReceta", nullable = false) // Keep the column name in Spanish
  private Recipe recipe;

  @Column(name = "urlFoto") // Map to the Spanish column name
  private String photoUrl;

  @Column(name = "extension") // Map to the Spanish column name
  private String extension;
}