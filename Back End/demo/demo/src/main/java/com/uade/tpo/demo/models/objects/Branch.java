package com.uade.tpo.demo.models.objects;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sedes") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Branch {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idSede") // Map to the Spanish column name
  private Integer idBranch;

  @Column(name = "nombreSede", nullable = false, length = 150) // Map to the Spanish column name
  private String branchName;

  @Column(name = "direccionSede", nullable = false, length = 250) // Map to the Spanish column name
  private String branchAddress;

  @Column(name = "telefonoSede", length = 15) // Map to the Spanish column name
  private String branchPhone;

  @Column(name = "mailSede", length = 150) // Map to the Spanish column name
  private String branchEmail;

  @Column(name = "whatsApp", length = 15) // Map to the Spanish column name
  private String whatsApp;

  @Column(name = "tipoBonificacion", length = 20) // Map to the Spanish column name
  private String discountType;

  @Column(name = "bonificacionCursos") // Map to the Spanish column name
  private Double courseDiscount;

  @Column(name = "tipoPromocion", length = 20) // Map to the Spanish column name
  private String promotionType;

  @Column(name = "promocionCursos") // Map to the Spanish column name
  private Double coursePromotion;

  @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<CourseSchedule> courseSchedules;
}