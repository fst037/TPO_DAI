package com.uade.tpo.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.models.objects.CourseSchedule;

@Repository
public interface CourseScheduleRepository extends JpaRepository<CourseSchedule, Integer> {
  
}
