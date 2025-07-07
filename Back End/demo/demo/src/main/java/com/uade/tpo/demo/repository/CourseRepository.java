package com.uade.tpo.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.models.objects.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
  
  @Query("SELECT DISTINCT c FROM Course c " +
      "LEFT JOIN c.courseSchedules cs " +
      "WHERE (:courseName IS NULL OR LOWER(c.description) LIKE %:courseName%) " +
      "AND (:modality IS NULL OR c.modality = :modality) " +
      "AND (:minDuration IS NULL OR c.duration >= :minDuration) " +
      "AND (:maxDuration IS NULL OR c.duration <= :maxDuration) " +
      "AND (:minPrice IS NULL OR c.price >= :minPrice) " +
      "AND (:maxPrice IS NULL OR c.price <= :maxPrice) " +
      "AND (:branchIds IS NULL OR (cs IS NOT NULL AND cs.branch.id IN :branchIds))")
  public List<Course> findByFilter(
      @Param("courseName") String courseName,
      @Param("modality") String modality,
      @Param("minDuration") Integer minDuration,
      @Param("maxDuration") Integer maxDuration,
      @Param("minPrice") Double minPrice,
      @Param("maxPrice") Double maxPrice,
      @Param("branchIds") List<Integer> branchIds
  );
}
