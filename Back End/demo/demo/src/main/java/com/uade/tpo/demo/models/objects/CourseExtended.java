package com.uade.tpo.demo.models.objects;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course_extended")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseExtended {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_course_extended")
    private Integer idCourseExtended;

    @OneToOne
    @JoinColumn(name = "id_course", referencedColumnName = "idCurso", nullable = false)
    private Course course;

    @Column(name = "photo", length = 1000)
    private String photo;
}
