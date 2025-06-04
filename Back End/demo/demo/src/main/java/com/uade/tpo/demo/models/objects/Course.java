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
  @Column(name = "idCurso")
  private Integer idCourse;

  @Column(name = "descripcion", length = 300)
  private String description;

  @Column(name = "contenidos", length = 500)
  private String contents;

  @Column(name = "requerimientos", length = 500)
  private String requirements;

  @Column(name = "duracion")
  private Integer duration;

  @Column(name = "precio")
  private Double price;

  @Column(name = "modalidad", length = 20)
  private String modality;

  @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<CourseSchedule> courseSchedules;

  @OneToOne(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  private CourseExtended courseExtended;
}