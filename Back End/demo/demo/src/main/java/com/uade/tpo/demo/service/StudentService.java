package com.uade.tpo.demo.service;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import com.uade.tpo.demo.models.enums.Role;
import com.uade.tpo.demo.models.objects.CourseAttendance;
import com.uade.tpo.demo.models.objects.CourseSchedule;
import com.uade.tpo.demo.models.objects.Student;
import com.uade.tpo.demo.models.requests.PaymentMethodRequest;
import com.uade.tpo.demo.repository.StudentRepository;

@Service
public class StudentService {
  
  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private CourseScheduleService courseScheduleService;

  @Autowired
  private MailService mailService;

  public List<Student> getAllStudents() {
    return studentRepository.findAll();
  }

  public Student getStudentById(Integer id) {
    return studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
  }

  public Student getStudentByEmail(Principal principal) {
    return studentRepository.findByUserEmail(principal.getName())
      .stream().findFirst()
      .orElseThrow(() -> new RuntimeException("Student not found"));
  }

  public Student changePaymentMethod(Principal principal, PaymentMethodRequest paymentMethodRequest) {
    Student student = studentRepository.findByUserEmail(principal.getName())
      .stream().findFirst()
      .orElseThrow(() -> new RuntimeException("Student not found"));

    if (!student.getUser().getUserExtended().getRoles().contains(Role.STUDENT)) {
      throw new RuntimeException("User is not a student");
    }

    if (student.getUser().getEnabled().equals("no")) {
      throw new RuntimeException("User is disabled");
    }

    student.getStudentExtended().setCardName(paymentMethodRequest.getCardName());
    student.getStudentExtended().setCardExpiry(paymentMethodRequest.getCardExpiry());
    student.getStudentExtended().setCardCvv(paymentMethodRequest.getCardCvv());

    return studentRepository.save(student);
  }

  public Student markCourseAssistance(Principal principal, Integer courseScheduleId, String date) {
    Student student = studentRepository.findByUserEmail(principal.getName())
      .stream().findFirst()
      .orElseThrow(() -> new RuntimeException("Student not found"));

    if (!student.getUser().getUserExtended().getRoles().contains(Role.STUDENT)) {
      throw new RuntimeException("User is not a student");
    }

    if (student.getUser().getEnabled().equals("no")) {
      throw new RuntimeException("User is disabled");
    }

    CourseSchedule courseSchedule = student.getStudentExtended().getCurrentCourses().stream()
      .filter(course -> course.getIdCourseSchedule().equals(courseScheduleId))
      .findFirst()
      .orElseThrow(() -> new RuntimeException("User is not enrolled in the course with ID: " + courseScheduleId));

    LocalDate inputDate = LocalDate.parse(date);
    LocalDate today = LocalDate.now();

    if (!inputDate.isEqual(today)) {
      throw new RuntimeException("The date must be today" );
    }

    boolean alreadyMarked = courseSchedule.getCourseAttendances().stream()
      .anyMatch(attendance -> attendance.getCourseSchedule().getIdCourseSchedule().equals(courseScheduleId) &&
        attendance.getDate().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate().isEqual(today));

    if (alreadyMarked) {
      throw new RuntimeException("Attendance for this course on the specified date has already been marked");
    }

    CourseAttendance courseAttendance = new CourseAttendance();
    
    courseAttendance.setCourseSchedule(courseSchedule);
    courseAttendance.setStudent(student);
    courseAttendance.setDate(new java.util.Date());

    student.getCourseAttendances().add(courseAttendance);

    return studentRepository.save(student);
  }

  public Student enrollInCourseWithCreditCard(Principal principal, Integer courseScheduleId) throws MessagingException {
    System.out.println(principal.getName());
    Student student = studentRepository.findByUserEmail(principal.getName())
      .stream().findFirst()
      .orElseThrow(() -> new RuntimeException("Student not found"));

    if (!student.getUser().getUserExtended().getRoles().contains(Role.STUDENT)) {
      throw new RuntimeException("User is not a student");
    }

    if (student.getUser().getEnabled().equals("no")) {
      throw new RuntimeException("User is disabled");
    }

    CourseSchedule courseSchedule = courseScheduleService.getCourseScheduleById(courseScheduleId);
    courseSchedule.setAvailableSlots(courseSchedule.getAvailableSlots() - 1);

    student.getStudentExtended().getCurrentCourses().add(courseSchedule);

    mailService.sendEnrollmentConfirmation(principal.getName(), courseSchedule.getStartDate(), courseSchedule.getEndDate(), courseSchedule.getCourse().getPrice(), courseSchedule.getCourse().getRequirements(), courseSchedule.getCourse().getDescription());

    return studentRepository.save(student);
  }

  public Student dropOutOfCourseToCreditCard(Principal principal, Integer courseScheduleId) {
    Student student = studentRepository.findByUserEmail(principal.getName())
      .stream().findFirst()
      .orElseThrow(() -> new RuntimeException("Student not found"));

    if (!student.getUser().getUserExtended().getRoles().contains(Role.STUDENT)) {
      throw new RuntimeException("User is not a student");
    }

    if (student.getUser().getEnabled().equals("no")) {
      throw new RuntimeException("User is disabled");
    }

    CourseSchedule courseSchedule = student.getStudentExtended().getCurrentCourses().stream()
      .filter(course -> course.getIdCourseSchedule().equals(courseScheduleId))
      .findFirst()
      .orElseThrow(() -> new RuntimeException("User is not enrolled in the course with ID: " + courseScheduleId));

    student.getStudentExtended().getCurrentCourses().remove(courseSchedule);

    return studentRepository.save(student);
  }

  public Student dropOutOfCourseToAppBalance(Principal principal, Integer courseScheduleId) {
    Student student = studentRepository.findByUserEmail(principal.getName())
      .stream().findFirst()
      .orElseThrow(() -> new RuntimeException("Student not found"));

    if (!student.getUser().getUserExtended().getRoles().contains(Role.STUDENT)) {
      throw new RuntimeException("User is not a student");
    }

    if (student.getUser().getEnabled().equals("no")) {
      throw new RuntimeException("User is disabled");
    }

    CourseSchedule courseSchedule = student.getStudentExtended().getCurrentCourses().stream()
      .filter(course -> course.getIdCourseSchedule().equals(courseScheduleId))
      .findFirst()
      .orElseThrow(() -> new RuntimeException("User is not enrolled in the course with ID: " + courseScheduleId));

    student.getStudentExtended().getCurrentCourses().remove(courseSchedule);

    courseSchedule.setAvailableSlots(courseSchedule.getAvailableSlots() + 1);
    courseScheduleService.saveCourseSchedule(courseSchedule);

    student.setBalance(student.getBalance() + courseSchedule.getCourse().getPrice());//TODO: hacer logica de reembolso bien

    return studentRepository.save(student);
  }
}
