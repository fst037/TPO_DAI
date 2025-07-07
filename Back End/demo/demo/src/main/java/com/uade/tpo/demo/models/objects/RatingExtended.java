package com.uade.tpo.demo.models.objects;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Table(name = "rating_extended")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingExtended {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_rating_extended")
  private Integer idRatingExtended;

  @OneToOne
  @JoinColumn(name = "id_rating", referencedColumnName = "idCalificacion", nullable = false)
  private Rating rating;
  
  @Column(name = "is_enabled")
  private Boolean isEnabled;

  @Column(name = "created_at", nullable = false)
  private String createdAt;
  
}
