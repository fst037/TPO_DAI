package com.uade.tpo.demo.models.objects;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "calificaciones") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idCalificacion") // Map to the Spanish column name
  private Integer idRating;

  @ManyToOne
  @JoinColumn(name = "idUsuario") // Keep the column name in Spanish
  private User user;

  @ManyToOne
  @JoinColumn(name = "idReceta") // Keep the column name in Spanish
  private Recipe recipe;

  @Column(name = "calificacion") // Map to the Spanish column name
  private Integer rating;

  @Column(name = "comentarios", length = 500) // Map to the Spanish column name
  private String comments;

  @OneToOne(mappedBy = "rating", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private RatingExtended ratingExtended;
}