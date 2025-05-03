package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.Course;
import com.uade.tpo.demo.models.requests.CourseRequest;
import com.uade.tpo.demo.repository.CourseRepository;

@Service
public class CourseService {

  @Autowired
  private CourseRepository courseRepository;

  public List<Course> getAllCourses() {
    return courseRepository.findAll();
  }

  public Course getCourseById(Integer id) {
    return courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
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
    return courseRepository.save(course);
  }

  public void deleteCourse(Integer id) {
    courseRepository.deleteById(id);
  }
}
