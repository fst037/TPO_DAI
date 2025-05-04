package com.uade.tpo.demo.models.objects;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Table(name = "student_extended")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentExtended {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_student_extended")
  private Integer idStudentExtended;

  @OneToOne
  @JoinColumn(name = "id_student", referencedColumnName = "idAlumno", nullable = false)
  private Student student;

  @ManyToMany
  @JoinTable(
    name = "courses_inscriptions", // Name of the join table
    joinColumns = @JoinColumn(name = "id_student_extended"), // Foreign key to UserExtended
    inverseJoinColumns = @JoinColumn(name = "id_course_schedule") // Foreign key to Recipe
  )
  private List<CourseSchedule> courses;

}
