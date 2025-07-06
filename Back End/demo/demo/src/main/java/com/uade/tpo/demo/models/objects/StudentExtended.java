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

  @Column(name = "card_name", nullable = false)
  private String cardName;

  @Column(name = "card_expiry", nullable = false)
  private String cardExpiry;

  @ManyToMany
  @JoinTable(
    name = "courses_current",
    joinColumns = @JoinColumn(name = "id_student_extended"),
    inverseJoinColumns = @JoinColumn(name = "id_course_schedule")
  )
  private List<CourseSchedule> currentCourses;

  @ManyToMany
  @JoinTable(
    name = "courses_finished",
    joinColumns = @JoinColumn(name = "id_student_extended"),
    inverseJoinColumns = @JoinColumn(name = "id_course_schedule")
  )
  private List<CourseSchedule> finishedCourses;
}
