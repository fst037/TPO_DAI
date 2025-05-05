package com.uade.tpo.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.models.objects.CourseSchedule;

@Repository
public interface CourseScheduleRepository extends JpaRepository<CourseSchedule, Integer> {
  
  @Query("SELECT cs FROM CourseSchedule cs WHERE cs.course.idCourse = ?1")
  List<CourseSchedule> findByCourseId(Integer courseId);
}
