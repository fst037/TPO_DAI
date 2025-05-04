package com.uade.tpo.demo.models.objects;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Table(name = "course_schedule_extended")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseScheduleExtended {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_course_schedule_extended")
  private Integer idCourseScheduleExtended;

  @OneToOne
  @JoinColumn(name = "id_course_schedule", referencedColumnName = "idCronograma", nullable = false)
  private CourseSchedule courseSchedule;
  
  @Column(name = "professor_name", nullable = false)
  private String professorName;

  @Column(name = "professor_photo", nullable = false)
  private String professorPhoto;
  
  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "course_schedule_extended_dates", joinColumns = @JoinColumn(name = "id_course_schedule_extended"))
  @Column(name = "course_date", nullable = false)
  private List<String> courseDates;
}
