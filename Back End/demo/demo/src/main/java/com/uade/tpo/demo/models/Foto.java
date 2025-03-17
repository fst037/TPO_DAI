package com.uade.tpo.demo.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fotos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Foto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idFoto;

	@ManyToOne
	@JoinColumn(name = "idReceta", nullable = false)
	private Receta receta;

	private String urlFoto;
	private String extension;
}
