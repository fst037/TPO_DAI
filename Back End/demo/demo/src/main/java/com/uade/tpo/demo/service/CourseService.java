package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.Course;
import com.uade.tpo.demo.models.objects.CourseExtended;
import com.uade.tpo.demo.models.requests.CourseFilterRequest;
import com.uade.tpo.demo.models.requests.CourseRequest;
import com.uade.tpo.demo.repository.CourseRepository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.sql.Date;

@Service
public class CourseService {

  @Autowired
  private CourseRepository courseRepository;

  private Date parseDate(String dateString) {
    if (dateString == null || dateString.isEmpty()) {
      return null;
    }
    try {
      return new java.sql.Date(new SimpleDateFormat("yyyy-MM-dd").parse(dateString).getTime());
    } catch (ParseException e) {
      throw new RuntimeException("Invalid date format: " + dateString, e);
    }
  }

  public List<Course> getAllCourses() {
    return courseRepository.findAll();
  }

  public Course getCourseById(Integer id) {
    return courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
  }

  public List<Course> filterCourses(CourseFilterRequest courseFilterRequest) {
    String courseName = courseFilterRequest.getCourseName();
    if (courseName != null) {
      courseName = courseName.toLowerCase();
    }
    List<Integer> branchIds = courseFilterRequest.getBranchIds();
    // Pass null if no filter is needed (null or empty)
    if (branchIds == null || branchIds.isEmpty()) {
      branchIds = null;
    }

    List<Course> courses = courseRepository.findByFilter(
        courseName,
        courseFilterRequest.getModality(),
        courseFilterRequest.getMinDuration(),
        courseFilterRequest.getMaxDuration(),
        courseFilterRequest.getMinPrice(),
        courseFilterRequest.getMaxPrice(),
        branchIds
    );

    String minStartDateStr = courseFilterRequest.getMinStartDate();
    String maxEndDateStr = courseFilterRequest.getMaxEndDate();
    java.sql.Date minStartDate = (minStartDateStr != null && !minStartDateStr.isEmpty()) ? parseDate(minStartDateStr) : null;
    java.sql.Date maxEndDate = (maxEndDateStr != null && !maxEndDateStr.isEmpty()) ? parseDate(maxEndDateStr) : null;

    if (minStartDate != null || maxEndDate != null) {
      courses = courses.stream().filter(course -> {
        if (course.getCourseSchedules() == null || course.getCourseSchedules().isEmpty()) {
          return false;
        }
        return course.getCourseSchedules().stream().anyMatch(cs -> {
          boolean minOk = minStartDate == null || (cs.getStartDate() != null && !cs.getStartDate().before(minStartDate));
          boolean maxOk = maxEndDate == null || (cs.getEndDate() != null && !cs.getEndDate().after(maxEndDate));
          return minOk && maxOk;
        });
      }).toList();
    }
    return courses;
  }

  public Course createCourse(CourseRequest courseRequest) {
    Course course = new Course();
    course.setDescription(courseRequest.getDescription());
    course.setContents(courseRequest.getContents());
    course.setRequirements(courseRequest.getRequirements());
    course.setDuration(courseRequest.getDuration());
    course.setPrice(courseRequest.getPrice());
    course.setModality(courseRequest.getModality());
    course.setCourseSchedules(List.of());

    CourseExtended courseExtended = new CourseExtended();
    courseExtended.setPhoto(courseRequest.getCoursePhoto());
    courseExtended.setCourse(course);
    course.setCourseExtended(courseExtended);

    return courseRepository.save(course);
  }

  public Course updateCourse(Integer id, CourseRequest courseRequest) {
    Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
    course.setDescription(courseRequest.getDescription());
    course.setContents(courseRequest.getContents());
    course.setRequirements(courseRequest.getRequirements());
    course.setDuration(courseRequest.getDuration());
    course.setPrice(courseRequest.getPrice());
    course.setModality(courseRequest.getModality());

    if (course.getCourseExtended() == null) {
      CourseExtended courseExtended = new CourseExtended();
      courseExtended.setCourse(course);
      course.setCourseExtended(courseExtended);
    }
    course.getCourseExtended().setPhoto(courseRequest.getCoursePhoto());

    return courseRepository.save(course);
  }

  public void deleteCourse(Integer id) {
    courseRepository.deleteById(id);
  }
}
