package com.uade.tpo.demo.models.objects;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cursos") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idCurso") // Map to the Spanish column name
  private Integer idCourse;

  @Column(name = "descripcion", length = 300) // Map to the Spanish column name
  private String description;

  @Column(name = "contenidos", length = 500) // Map to the Spanish column name
  private String contents;

  @Column(name = "requerimientos", length = 500) // Map to the Spanish column name
  private String requirements;

  @Column(name = "duracion") // Map to the Spanish column name
  private Integer duration;

  @Column(name = "precio") // Map to the Spanish column name
  private Double price;

  @Column(name = "modalidad", length = 20) // Map to the Spanish column name
  private String modality;

  @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<CourseSchedule> courseSchedules;
}