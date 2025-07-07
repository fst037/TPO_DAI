package com.uade.tpo.demo.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.models.requests.CourseScheduleRequest;
import com.uade.tpo.demo.models.responses.AttendanceDTO;
import com.uade.tpo.demo.models.responses.CourseScheduleDTO;
import com.uade.tpo.demo.service.CourseScheduleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/course-schedules")
@Tag(name = "Cronogramas de Cursos", description = "Endpoints para la gestión de cronogramas de cursos")
public class CourseScheduleController {

  @Autowired
  private CourseScheduleService courseScheduleService;

  @GetMapping("/")
  @Operation(
      summary = "Obtener todos los cronogramas de cursos",
      description = "Devuelve una lista de todos los cronogramas de cursos disponibles en el sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de cronogramas obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = CourseScheduleDTO.class))
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getAllCourseSchedules() {
    try {
      return ResponseEntity.ok(courseScheduleService.getAllCourseSchedules().stream().map(CourseScheduleDTO::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{id}")
  @Operation(
      summary = "Obtener un cronograma de curso por ID",
      description = "Devuelve los detalles de un cronograma de curso específico basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Cronograma obtenido exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = CourseScheduleDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Cronograma no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getCourseScheduleById(@PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new CourseScheduleDTO(courseScheduleService.getCourseScheduleById(id)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/course/{courseId}")
  @Operation(
      summary = "Obtener cronogramas de curso por ID de curso",
      description = "Devuelve una lista de cronogramas de curso asociados a un curso específico."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de cronogramas obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = CourseScheduleDTO.class))
          )),
      @ApiResponse(responseCode = "404", description = "Curso no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getCourseSchedulesByCourseId(@PathVariable Integer courseId) {
    try {
      return ResponseEntity.ok(courseScheduleService.getCourseSchedulesByCourseId(courseId).stream().map(CourseScheduleDTO::new).toList());
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/")
  @Operation(
      summary = "Crear un nuevo cronograma de curso",
      description = "Crea un nuevo cronograma de curso en el sistema.",
      requestBody = @RequestBody(description = "Detalles del cronograma a crear", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = CourseScheduleRequest.class)
          )
      )

  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Cronograma creado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = CourseScheduleDTO.class)
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> createCourseSchedule(
      @org.springframework.web.bind.annotation.RequestBody CourseScheduleRequest courseScheduleRequest) {
    try {
      return ResponseEntity.ok(new CourseScheduleDTO(courseScheduleService.createCourseSchedule(courseScheduleRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  @Operation(
      summary = "Actualizar un cronograma de curso",
      description = "Actualiza los detalles de un cronograma de curso existente basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Cronograma actualizado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = CourseScheduleDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Cronograma no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateCourseSchedule(
      @PathVariable Integer id,
      @RequestBody(description = "Detalles del cronograma a actualizar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = CourseScheduleRequest.class)
          )
      ) CourseScheduleRequest courseScheduleRequest) {
    try {
      return ResponseEntity.ok(new CourseScheduleDTO(courseScheduleService.updateCourseSchedule(id, courseScheduleRequest)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  @Operation(
      summary = "Eliminar un cronograma de curso",
      description = "Elimina un cronograma de curso existente basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Cronograma eliminado exitosamente",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "404", description = "Cronograma no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> deleteCourseSchedule(@PathVariable Integer id) {
    try {
      courseScheduleService.deleteCourseSchedule(id);
      return ResponseEntity.ok("Cronograma eliminado exitosamente.");
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{courseScheduleId}/attendance")
  @Operation(
      summary = "Obtener asistencia de un usuario a un cronograma de curso",
      description = "Devuelve la información de asistencia de un usuario específico a un cronograma de curso, comparando las fechas de asistencia con las fechas programadas del curso."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Información de asistencia obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = AttendanceDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Cronograma no encontrado o usuario no es estudiante",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getAttendanceToCourseSchedule(
      @PathVariable Integer courseScheduleId,
      Principal principal) {
    try {
      AttendanceDTO attendance = courseScheduleService.getAttendanceToCourseSchedule(courseScheduleId, principal.getName());
      return ResponseEntity.ok(attendance);
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
