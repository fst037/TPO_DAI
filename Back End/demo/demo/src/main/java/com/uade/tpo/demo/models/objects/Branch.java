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
  @Column(name = "idSede")
  private Integer idBranch;

  @Column(name = "nombreSede", nullable = false, length = 150)
  private String branchName;

  @Column(name = "direccionSede", nullable = false, length = 250)
  private String branchAddress;

  @Column(name = "telefonoSede", length = 15)
  private String branchPhone;

  @Column(name = "mailSede", length = 150)
  private String branchEmail;

  @Column(name = "whatsApp", length = 15)
  private String whatsApp;

  @Column(name = "tipoBonificacion", length = 20)
  private String discountType;

  @Column(name = "bonificacionCursos")
  private Double courseDiscount;

  @Column(name = "tipoPromocion", length = 20)
  private String promotionType;

  @Column(name = "promocionCursos")
  private Double coursePromotion;

  @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<CourseSchedule> courseSchedules;
}