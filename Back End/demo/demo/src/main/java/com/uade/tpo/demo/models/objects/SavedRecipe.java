package com.uade.tpo.demo.models.objects;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recetasGuardadas") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavedRecipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idRecetaGuardada")
    private Integer idSavedRecipe;

    @ManyToOne
    @JoinColumn(name = "idUsuario", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "idReceta", nullable = false) 
    private Recipe recipe;
}
