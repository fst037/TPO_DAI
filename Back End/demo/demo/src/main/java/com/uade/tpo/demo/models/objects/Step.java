package com.uade.tpo.demo.models.objects;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pasos") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Step {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idPaso")
  private Integer idStep;

  @ManyToOne
  @JoinColumn(name = "idReceta")
  private Recipe recipe;

  @Column(name = "nroPaso")
  private Integer stepNumber;

  @Column(name = "texto", length = 4000)
  private String text;
  
  @OneToMany(mappedBy = "step", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<MultimediaContent> multimedia;
}