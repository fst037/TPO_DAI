package com.uade.tpo.demo.models.objects;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "alumnos") // Keep the table name in Spanish
public class Student {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idAlumno")
  private Integer idStudent;

  @Column(name = "numeroTarjeta")
  private String cardNumber;

  @Column(name = "dniFrente")
  private String dniFront;

  @Column(name = "dniFondo")
  private String dniBack;

  @Column(name = "tramite")
  private String procedureNumber;

  @Column(name = "cuentaCorriente")
  private Double currentAccount;

  @OneToOne(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "usuario_id", referencedColumnName = "idUsuario")
  private User user;

  @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<CourseAttendance> courseAttendances;

}