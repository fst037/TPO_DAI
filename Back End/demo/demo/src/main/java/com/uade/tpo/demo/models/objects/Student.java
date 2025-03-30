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
  @Column(name = "idAlumno") // Map to the Spanish column name
  private Integer idStudent;

  @Column(name = "numeroTarjeta") // Map to the Spanish column name
  private String cardNumber;

  @Column(name = "dniFrente") // Map to the Spanish column name
  private String dniFront;

  @Column(name = "dniFondo") // Map to the Spanish column name
  private String dniBack;

  @Column(name = "tramite") // Map to the Spanish column name
  private String procedureNumber;

  @Column(name = "cuentaCorriente") // Map to the Spanish column name
  private Double currentAccount;

  @OneToOne(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "usuario_id", referencedColumnName = "idUsuario") // Keep the column name in Spanish
  private User user;

  @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<CourseAttendance> courseAttendances;

}