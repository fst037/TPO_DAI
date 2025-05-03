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
  @Column(name = "idCalificacion")
  private Integer idRating;

  @ManyToOne
  @JoinColumn(name = "idUsuario")
  private User user;

  @ManyToOne
  @JoinColumn(name = "idReceta")
  private Recipe recipe;

  @Column(name = "calificacion")
  private Integer rating;

  @Column(name = "comentarios", length = 500)
  private String comments;

  @OneToOne(mappedBy = "rating", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  private RatingExtended ratingExtended;
}