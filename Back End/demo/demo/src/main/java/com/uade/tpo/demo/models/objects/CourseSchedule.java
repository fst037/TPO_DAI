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
  @Column(name = "idCronograma")
  private Integer idSchedule;

  @ManyToOne
  @JoinColumn(name = "idSede", nullable = false)
  private Branch branch;

  @ManyToOne
  @JoinColumn(name = "idCurso", nullable = false)
  private Course course;

  @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<CourseAttendance> courseAttendances;

  @Column(name = "fechaInicio")
  private Date startDate;

  @Column(name = "fechaFin")
  private Date endDate;

  @Column(name = "vacantesDisponibles")
  private Integer availableSlots;
}