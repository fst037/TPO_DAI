package com.uade.tpo.demo.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.CourseSchedule;
import com.uade.tpo.demo.models.objects.CourseScheduleExtended;
import com.uade.tpo.demo.models.objects.CourseAttendance;
import com.uade.tpo.demo.models.objects.Student;
import com.uade.tpo.demo.models.objects.User;
import com.uade.tpo.demo.models.requests.CourseScheduleRequest;
import com.uade.tpo.demo.models.responses.AttendanceDTO;
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
  
  @Autowired
  private UserService userService;

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

  public AttendanceDTO getAttendanceToCourseSchedule(Integer courseScheduleId, String userEmail) {
    // Get the course schedule
    CourseSchedule courseSchedule = courseScheduleRepository.findById(courseScheduleId)
        .orElseThrow(() -> new RuntimeException("CourseSchedule not found"));
    
    // Get the user
    User user = userService.getUserByEmail(userEmail)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Get the student from the user
    Student student = user.getStudent();
    if (student == null) {
      throw new RuntimeException("User is not a student");
    }
    
    // Get attendance records for this student and course schedule
    List<CourseAttendance> attendances = student.getCourseAttendances().stream()
        .filter(attendance -> attendance.getCourseSchedule().getIdCourseSchedule().equals(courseScheduleId))
        .collect(Collectors.toList());
    
    // Get scheduled dates from course schedule extended
    List<String> scheduledDates = courseSchedule.getCourseScheduleExtended().getCourseDates();
    
    // Create attendance records based on scheduled dates
    List<AttendanceDTO.AttendanceRecord> attendanceRecords = scheduledDates.stream()
        .map(scheduledDate -> {
          try {
            Date scheduled = new SimpleDateFormat("yyyy-MM-dd").parse(scheduledDate);
            
            // Check if user attended this specific date
            boolean attended = attendances.stream()
                .anyMatch(attendance -> isSameDay(attendance.getDate(), scheduled));
            
            return new AttendanceDTO.AttendanceRecord(scheduledDate, attended);
          } catch (ParseException e) {
            return new AttendanceDTO.AttendanceRecord(scheduledDate, false);
          }
        })
        .collect(Collectors.toList());
    
    // Calculate statistics
    int totalScheduledClasses = scheduledDates.size();
    int attendedClasses = (int) attendanceRecords.stream()
        .mapToLong(record -> record.getAttended() ? 1 : 0)
        .sum();
    double attendancePercentage = totalScheduledClasses > 0 ? 
        (double) attendedClasses / totalScheduledClasses * 100 : 0.0;
    
    // Create and populate DTO
    AttendanceDTO dto = new AttendanceDTO();
    dto.setCourseScheduleId(courseScheduleId);
    dto.setCourseName(courseSchedule.getCourse().getDescription());
    dto.setProfessorName(courseSchedule.getCourseScheduleExtended().getProfessorName());
    dto.setStartDate(courseSchedule.getStartDate() != null ? courseSchedule.getStartDate().toString() : null);
    dto.setEndDate(courseSchedule.getEndDate() != null ? courseSchedule.getEndDate().toString() : null);
    dto.setScheduledDates(scheduledDates);
    dto.setAttendanceRecords(attendanceRecords);
    dto.setAttendancePercentage(Math.round(attendancePercentage * 100.0) / 100.0);
    dto.setTotalScheduledClasses(totalScheduledClasses);
    dto.setAttendedClasses(attendedClasses);
    
    return dto;
  }
  
  private boolean isSameDay(Date date1, Date date2) {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    return sdf.format(date1).equals(sdf.format(date2));
  }
}
