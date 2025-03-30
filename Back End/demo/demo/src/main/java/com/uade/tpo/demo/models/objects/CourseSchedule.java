package com.uade.tpo.demo.models.objects;

import java.util.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cronogramaCursos") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseSchedule {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idCronograma") // Map to the Spanish column name
  private Integer idSchedule;

  @ManyToOne
  @JoinColumn(name = "idSede", nullable = false) // Keep the column name in Spanish
  private Branch branch;

  @ManyToOne
  @JoinColumn(name = "idCurso", nullable = false) // Keep the column name in Spanish
  private Course course;

  @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<CourseAttendance> courseAttendances;

  @Column(name = "fechaInicio") // Map to the Spanish column name
  private Date startDate;

  @Column(name = "fechaFin") // Map to the Spanish column name
  private Date endDate;

  @Column(name = "vacantesDisponibles") // Map to the Spanish column name
  private Integer availableSlots;
}