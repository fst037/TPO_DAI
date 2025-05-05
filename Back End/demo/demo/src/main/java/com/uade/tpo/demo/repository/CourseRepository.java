package com.uade.tpo.demo.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.models.objects.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
  
  @Query("SELECT c FROM Course c WHERE "
      + "(:courseName IS NULL OR c.description LIKE %:courseName%) AND "
      + "(:modality IS NULL OR c.modality = :modality) AND "
      + "(:minDuration IS NULL OR c.duration >= :minDuration) AND "
      + "(:maxDuration IS NULL OR c.duration <= :maxDuration) AND "
      + "(:minPrice IS NULL OR c.price >= :minPrice) AND "
      + "(:maxPrice IS NULL OR c.price <= :maxPrice) AND "
      + "(:minStartDate IS NULL OR EXISTS (SELECT cs FROM CourseSchedule cs WHERE cs.course.id = c.id AND cs.startDate >= :minStartDate)) AND "
      + "(:maxEndDate IS NULL OR EXISTS (SELECT cs FROM CourseSchedule cs WHERE cs.course.id = c.id AND cs.endDate <= :maxEndDate))")
  public List<Course> findByFilter(
      String courseName,
      String modality,
      Integer minDuration,
      Integer maxDuration,
      Double minPrice,
      Double maxPrice,
      Date minStartDate,
      Date maxEndDate
  );
}
