package com.uade.tpo.demo.controllers;

import com.uade.tpo.demo.models.requests.PaymentMethodRequest;
import com.uade.tpo.demo.models.responses.StudentDTO;
import com.uade.tpo.demo.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/students")
@Tag(name = "Alumnos", description = "Endpoints para la gestión de alumnos")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/{id}")
    @Operation(summary = "Obtener alumno por ID", description = "Devuelve los detalles de un alumno específico.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Alumno obtenido exitosamente",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))),
        @ApiResponse(responseCode = "404", description = "Alumno no encontrado")
    })
    public ResponseEntity<Object> getStudentById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(new StudentDTO(studentService.getStudentById(id)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PutMapping("/payment-method")
    @Operation(summary = "Actualizar método de pago", description = "Actualiza el método de pago del alumno.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Método de pago actualizado exitosamente",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))),
        @ApiResponse(responseCode = "404", description = "Alumno no encontrado")
    })
    public ResponseEntity<Object> changePaymentMethod(
        Principal principal,
        @RequestBody(description = "Detalles del método de pago a actualizar", required = true,
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PaymentMethodRequest.class)))
        PaymentMethodRequest paymentMethodRequest) {
        try {
            return ResponseEntity.ok(new StudentDTO(studentService.changePaymentMethod(principal, paymentMethodRequest)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/enroll/{courseScheduleId}")
    @Operation(summary = "Inscribirse en un curso", description = "Inscribe al alumno en un curso utilizando tarjeta de crédito.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Alumno inscrito exitosamente",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))),
        @ApiResponse(responseCode = "404", description = "Alumno o curso no encontrado")
    })
    public ResponseEntity<Object> enrollInCourseWithCreditCard(Principal principal, @PathVariable Integer courseScheduleId) {
        System.out.println("HOLAAAAAAAA");
        System.out.println(principal.getName());
        
        try {
            return ResponseEntity.ok(new StudentDTO(studentService.enrollInCourseWithCreditCard(principal, courseScheduleId)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/drop-out/credit-card/{courseScheduleId}")
    @Operation(summary = "Darse de baja de un curso (tarjeta de crédito)", description = "Darse de baja de un curso con reembolso a tarjeta de crédito.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Alumno dado de baja exitosamente",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))),
        @ApiResponse(responseCode = "404", description = "Alumno o curso no encontrado")
    })
    public ResponseEntity<Object> dropOutOfCourseToCreditCard(Principal principal, @PathVariable Integer courseScheduleId) {
        try {
            return ResponseEntity.ok(new StudentDTO(studentService.dropOutOfCourseToCreditCard(principal, courseScheduleId)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/drop-out/app-balance/{courseScheduleId}")
    @Operation(summary = "Darse de baja de un curso (saldo de la app)", description = "Darse de baja de un curso con reembolso al saldo de la app.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Alumno dado de baja exitosamente",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))),
        @ApiResponse(responseCode = "404", description = "Alumno o curso no encontrado")
    })
    public ResponseEntity<Object> dropOutOfCourseToAppBalance(Principal principal, @PathVariable Integer courseScheduleId) {
        try {
            return ResponseEntity.ok(new StudentDTO(studentService.dropOutOfCourseToAppBalance(principal, courseScheduleId)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/mark-assistance/{courseScheduleId}")
    @Operation(summary = "Marcar asistencia a un curso", description = "Marca la asistencia del alumno a un curso.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Asistencia marcada exitosamente",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))),
        @ApiResponse(responseCode = "404", description = "Alumno o curso no encontrado")
    })
    public ResponseEntity<Object> markCourseAssistance(Principal principal, @PathVariable Integer courseScheduleId) {
        try {
            return ResponseEntity.ok(new StudentDTO(studentService.markCourseAssistance(principal, courseScheduleId)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}
