package com.uade.tpo.demo.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.CourseSchedule;
import com.uade.tpo.demo.models.objects.CourseScheduleExtended;
import com.uade.tpo.demo.models.requests.CourseScheduleRequest;
import com.uade.tpo.demo.repository.CourseScheduleRepository;
import com.uade.tpo.demo.models.objects.Branch;
import com.uade.tpo.demo.models.objects.Course;
import com.uade.tpo.demo.repository.BranchRepository;
import com.uade.tpo.demo.repository.CourseRepository;

@Service
public class CourseScheduleService {

  @Autowired
  private CourseScheduleRepository courseScheduleRepository;

  @Autowired
  private CourseRepository courseRepository;

  @Autowired
  private BranchRepository branchRepository;

  private Date parseDate(String dateString) {
    try {
      return new SimpleDateFormat("yyyy-MM-dd").parse(dateString);
    } catch (ParseException e) {
      throw new RuntimeException("Invalid date format. Expected format: yyyy-MM-dd");
    }
  }

  public CourseSchedule saveCourseSchedule(CourseSchedule courseSchedule) {
    return courseScheduleRepository.save(courseSchedule);
  }

  public List<CourseSchedule> getAllCourseSchedules() {
    return courseScheduleRepository.findAll();
  }

  public CourseSchedule getCourseScheduleById(Integer id) {
    return courseScheduleRepository.findById(id).orElseThrow(() -> new RuntimeException("CourseSchedule not found"));
  }

  public List<CourseSchedule> getCourseSchedulesByCourseId(Integer courseId) {
    return courseScheduleRepository.findByCourseId(courseId);
  }

  public CourseSchedule createCourseSchedule(CourseScheduleRequest courseScheduleRequest) {
    CourseSchedule courseSchedule = new CourseSchedule();
    courseSchedule.setStartDate(parseDate(courseScheduleRequest.getStartDate()));
    courseSchedule.setEndDate(parseDate(courseScheduleRequest.getEndDate()));
    courseSchedule.setAvailableSlots(courseScheduleRequest.getAvailableSlots());
    courseSchedule.setCourseAttendances(List.of());
    courseSchedule.setStudentsEnrolled(List.of());
    courseSchedule.setStudentsGraduated(List.of());

    CourseScheduleExtended courseScheduleExtended = new CourseScheduleExtended();
    courseScheduleExtended.setCourseDates(Arrays.asList(courseScheduleRequest.getCourseDates()));
    courseScheduleExtended.setProfessorName(courseScheduleRequest.getProfessorName());
    courseScheduleExtended.setProfessorPhoto(courseScheduleRequest.getProfessorPhoto());
    courseScheduleExtended.setCourseSchedule(courseSchedule);

    courseSchedule.setCourseScheduleExtended(courseScheduleExtended);

    Course course = courseRepository.findById(courseScheduleRequest.getCourseId())
        .orElseThrow(() -> new RuntimeException("Course not found"));
    Branch branch = branchRepository.findById(courseScheduleRequest.getBranchId())
        .orElseThrow(() -> new RuntimeException("Branch not found"));

    courseSchedule.setCourse(course);
    courseSchedule.setBranch(branch);

    return courseScheduleRepository.save(courseSchedule);
  }

  public CourseSchedule updateCourseSchedule(Integer id, CourseScheduleRequest courseScheduleRequest) {
    CourseSchedule courseSchedule = courseScheduleRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("CourseSchedule not found"));
    courseSchedule.setStartDate(parseDate(courseScheduleRequest.getStartDate()));
    courseSchedule.setEndDate(parseDate(courseScheduleRequest.getEndDate()));
    courseSchedule.setAvailableSlots(courseScheduleRequest.getAvailableSlots());
    courseSchedule.getCourseScheduleExtended().setCourseDates(Arrays.asList(courseScheduleRequest.getCourseDates()));
    courseSchedule.getCourseScheduleExtended().setProfessorName(courseScheduleRequest.getProfessorName());
    courseSchedule.getCourseScheduleExtended().setProfessorPhoto(courseScheduleRequest.getProfessorPhoto());

    Course course = courseRepository.findById(courseScheduleRequest.getCourseId())
        .orElseThrow(() -> new RuntimeException("Course not found"));
    Branch branch = branchRepository.findById(courseScheduleRequest.getBranchId())
        .orElseThrow(() -> new RuntimeException("Branch not found"));

    courseSchedule.setCourse(course);
    courseSchedule.setBranch(branch);

    return courseScheduleRepository.save(courseSchedule);
  }

  public void deleteCourseSchedule(Integer id) {
    courseScheduleRepository.deleteById(id);
  }
}
